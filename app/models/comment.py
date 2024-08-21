from .db import db, environment, SCHEMA, add_prefix_for_prod


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == 'production':
         __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key= True)
    text = db.Column(db.String(2555), nullable=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('comments.id')), )

    # many to one
    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Post', back_populates='comments')