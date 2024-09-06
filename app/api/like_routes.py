from flask import Blueprint, request, jsonify
from flask_login import current_user
from app.models import db, Post, Like

like_routes = Blueprint('likes', __name__)

# POST /likes/:post_id (Like a post)
@like_routes.route('/<int:post_id>', methods=['POST'])
def like_post(post_id):
    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401

    post = Post.query.get(post_id)
    if not post:
        return {"error": "Post not found"}, 404

    # Check if the user already liked this post
    like = Like.query.filter_by(post_id=post_id, user_id=current_user.id).first()
    # print('like in route', like)
    if like:
        return {"error": "User already liked this post"}, 403

    new_like = Like(post_id=post_id, user_id=current_user.id)
    db.session.add(new_like)
    db.session.commit()

    return {"message": "Post liked"}, 201

# DELETE /likes/:post_id (Unlike a post)
@like_routes.route('/<int:post_id>', methods=['DELETE'])
def unlike_post(post_id):
    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401

    like = Like.query.filter_by(post_id=post_id, user_id=current_user.id).first()

    if not like:
        return {"error": "Like not found"}, 404

    db.session.delete(like)
    db.session.commit()

    return {"message": "Post unliked"}, 200

# GET /likes (Get all liked posts for the current user)
@like_routes.route('', methods=['GET'])
def get_liked_posts():
    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401

    likes = Like.query.filter_by(user_id=current_user.id).all()
    post_ids = [like.post_id for like in likes]
    posts = Post.query.filter(Post.id.in_(post_ids)).all()

    # Format the response
    liked_posts = [
        {
            'post_id': post.id,
            'text': post.text,
            'img': post.img,
            'user_id': post.user_id,
            'created_at': post.created_at,
            'comments': [comment.to_dict() for comment in post.comments]
        }
        for post in posts
    ]
    
    return jsonify({
        'likes': liked_posts
    })
    # return {'message':'likes'}