from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == 'production':
         __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key= True)
    text = db.Column(db.String(2555), nullable=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    parent_comment_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('comments.id')) )
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(tz=timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(tz=timezone.utc),
        onupdate=lambda: datetime.now(tz=timezone.utc),
    )

    # many to one
    user = db.relationship('User', back_populates='comments')
    post = db.relationship('Post', back_populates='comments')

    def to_dict(self):
         return {
              'id': self.id,
              'text': self.text,
              'post_id': self.post_id,
              'user_id': self.user_id,
              'parent_comment_id': self.parent_comment_id,
              'user': self.user,
              'post': self.post,
              'created_at': self.created_at,
              'updated_at': self.updated_at
         }

