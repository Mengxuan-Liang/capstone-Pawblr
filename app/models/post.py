from .db import db, environment, SCHEMA, add_prefix_for_prod
from .postlabel import postlabel
from datetime import datetime, timezone


class Post(db.Model):
    __tablename__ = "posts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    # title = db.Column(db.String(255), nullable=True)
    text = db.Column(db.String(2555), nullable=True)
    img = db.Column(db.String(2555))
    # tag = db.Column(db.String(2555))
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True
    )
    # The original post that this post is reblogging from
    original_post_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod('posts.id')), nullable=True
    )
    # The root post in the reblog chain
    root_post_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("posts.id")), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(tz=timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(tz=timezone.utc),
        onupdate=lambda: datetime.now(tz=timezone.utc),
    )

    # many to one
    user = db.relationship("User", back_populates="posts")
    original_post = db.relationship("Post", remote_side=[id], back_populates="reposts", foreign_keys=[original_post_id])
    root_post = db.relationship("Post", remote_side=[id], foreign_keys=[root_post_id])
    # one to many
    comments = db.relationship(
        "Comment", back_populates="post", cascade="all, delete-orphan"
    )
    likes = db.relationship("Like", back_populates="post", cascade="all, delete-orphan")
    reposts = db.relationship("Post", back_populates="original_post",foreign_keys=[original_post_id], cascade="all, delete-orphan")
    # many to many
    labels = db.relationship("Label", secondary=postlabel, back_populates="posts")

    def to_dict(self):
        def format_date(date):
            if date:
                return date.strftime("%b %d")
            return None

        return {
            "id": self.id,
            # "title": self.title,
            "text": self.text,
            "img": self.img,
            # 'tag':self.tag,
            "user_id": self.user_id,
            "user": (
                {
                    "profileImage": self.user.profileImage,
                    "username": self.user.username
                }
                if self.user
                else None
            ),
            "comments": (
                [comment.to_dict() for comment in self.comments]
                if self.comments
                else None
            ),
            "likes": [like.to_dict() for like in self.likes] if self.likes else None,
            "labels": (
                [label.to_dict() for label in self.labels] if self.labels else None
            ),
            "original_post": self.original_post.to_dict() if self.original_post else None,
            "root_post": self.root_post.to_dict() if self.original_post else None,
            "created_at": format_date(self.created_at),
            "updated_at": format_date(self.updated_at) if self.updated_at else None,
        }
