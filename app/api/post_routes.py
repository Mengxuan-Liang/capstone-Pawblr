from flask import Blueprint, request, jsonify
from flask_login import current_user
from app.models import db, Post
from app.forms import PostForm

post_routes = Blueprint('posts', __name__)

# GET all post, POST
@post_routes.route('/', methods=['GET', 'POST'])
def posts():
    if request.method == "POST":
        form = PostForm()
        form["csrf_token"].data = request.cookies["csrf_token"]

        if not current_user.is_authenticated:
            return {"error": "User not authenticated"}, 401
        
        if form.validate_on_submit():
            new_post = Post(
                text=form.data['text'],
                user_id=current_user.id
            )
            db.session.add(new_post)
            db.session.commit()
            return new_post.to_dict(), 201
        else:
            errors = {}
            for field, field_errors in form.errors.items():
                errors[field] = field_errors
            return jsonify(errors), 400
    else:
        
        posts = Post.query.order_by(Post.updated_at.desc(), Post.created_at.desc()).all()
        
        if not posts:
            return {'message': 'No Post Found'}, 404
        return [post.to_dict() for post in posts], 200

# PUT/DELETE
@post_routes.route('/<int:post_id>', methods=['PUT','DELETE'])
def post(post_id):
    post = Post.query.get(post_id)

    if not current_user.is_authenticated:
            return {"error": "User not authenticated"}, 401
    if post is None:
            return {"error": "Album not found"}, 404
    if post.user_id != current_user.id:
            return {"error": "Forbidden"}, 403
    if request.method == 'PUT':
         form = PostForm()
         form["csrf_token"].data = request.cookies["csrf_token"]
         data = request.json
         if form.validate_on_submit():
            #   post.title = data.get('title', post.title)
              post.text = data.get('text', post.text)

              db.session.commit()
              return post.to_dict(), 200
         return {'errors':form.errors}, 400
    elif request.method == 'DELETE':
         db.session.delete(post)
         db.session.commit()
         return {'message':'Post deleted'}, 200