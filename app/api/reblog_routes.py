from flask import Blueprint, request, jsonify
from app.models import db, Post, Comment
from flask_login import login_required, current_user

reblog_routes = Blueprint('reblogs', __name__ )

# POST 
@reblog_routes.route('/', methods=['POST'])
def reblog():
    data = request.get_json()
    original_post_id = data.get('original_post_id')

    original_post = Post.query.get(original_post_id)

    if not original_post:
        return jsonify({'error':'Origianl post not found'}), 404
    
    root_post_id = original_post.root_post_id if original_post.root_post_id else original_post.id

    reblogged_post = Post(
        user_id = current_user.id,
        original_post_id = original_post_id,
        root_post_id=root_post_id,
        text = original_post.text,
        img = original_post.img,
        # labels= original_post.labels
    )

    db.session.add(reblogged_post)
    db.session.commit()
    return jsonify(reblogged_post.to_dict()), 201