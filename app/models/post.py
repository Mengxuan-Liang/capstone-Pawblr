from .db import db, environment, SCHEMA, add_prefix_for_prod
from .postlabel import postlabel


class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    text = db.Column(db.String(2555), nullable=True)
    img = db.Column(db.String(2555))
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True)

    # many to one
    user = db.relationship('User', back_populates='posts')
    # one to many
    comments = db.relationship('Comment', back_populates='post', cascade="all, delete-orphan")
    likes = db.relationship('Like', back_populates='post', cascade="all, delete-orphan")
    # many to many
    labels = db.relationship(
        'Label',
        secondary=postlabel,
        back_populates='posts'
    )