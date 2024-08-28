from .db import db, environment, SCHEMA, add_prefix_for_prod

class Like(db.Model):
    __tablename__ = 'likes'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    

    # many to one
    user = db.relationship('User', back_populates='likes')
    post = db.relationship('Post', back_populates='likes')

    __table_args__ = (db.UniqueConstraint('post_id', 'user_id', name='unique_like'),)

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id':self.user_id,
            # 'user': self.user.to_dict() if self.user else None,
            # 'post': self.post.to_dict() if self.post else None
        }