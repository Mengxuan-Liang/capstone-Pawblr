from flask import Blueprint, request, jsonify
from flask_login import current_user
from app.models import db, Label, postlabel, Post
from app.forms import LabelForm

label_routes = Blueprint('labels', __name__)

# GET ALL TAGS
@label_routes.route('/', methods=['GET'])
def getTags():
     
    #  print('am i here???????????????????????????????????????')
     tags = Label.query.all()
    #  print('TAGS IN TAG TABLE FETCHED',tags)
     if not tags:
          return {'message':'no tag found'}, 404
     return  [tag.to_dict() for tag in tags]

# POST Adds a new label to the Labels table if it doesn't exist.
@label_routes.route('/', methods=['POST'])
def tags():
    form = LabelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if not current_user.is_authenticated:
            return {"error": "User not authenticated"}, 401
        
    if form.validate_on_submit():
          new_tag = Label(
                name = form.data['name']
          )
          db.session.add(new_tag)
          db.session.commit()
          return new_tag.to_dict(), 201
    else:
        errors = {}
        for field, field_errors in form.errors.items():
            errors[field] = field_errors
        return jsonify(errors), 400

# ATTACH  Associates a label with a post in the PostLabels table.
@label_routes.route('/<int:post_id>/attach', methods=['POST'])
def attach_label_to_post(post_id):

    # form = LabelForm()
    # form["csrf_token"].data = request.cookies["csrf_token"]
    # if form.validate_on_submit:
    #      labelName = form.data['name']
    label_id = request.json.get('label_id')

    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401

    # Check if the post exists
    post = Post.query.get(post_id)
    if not post:
        return {"error": "Post not found"}, 404

    # Check if the label exists
    label = Label.query.get(label_id)
    if not label:
        return {"error": "Label not found"}, 404

    # Check if the association already exists
    existing_association = postlabel.query.filter_by(post_id=post_id, label_id=label_id).first()
    if existing_association:
        return {"error": "Label is already associated with this post"}, 400

    # Create a new association
    post_label = postlabel(post_id=post_id, label_id=label_id)
    db.session.add(post_label)
    db.session.commit()

    return {"message": "Label successfully associated with the post"}, 201
# REMOVE label from post
@label_routes.route('/<int:post_id>/remove', methods=['DELETE'])
def remove_label_from_post(post_id):
    label_id = request.json.get('label_id')

    if not current_user.is_authenticated:
        return {"error": "User not authenticated"}, 401

    # Check if the association exists
    post_label = postlabel.query.filter_by(post_id=post_id, label_id=label_id).first()
    if not post_label:
        return {"error": "Association not found"}, 404

    # Remove the association
    db.session.delete(post_label)
    db.session.commit()

    return {"message": "Label successfully removed from the post"}, 200