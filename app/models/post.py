from .db import db, environment, SCHEMA, add_prefix_for_prod
from .postlabel import postlabel
from datetime import datetime, timezone


class Post(db.Model):
    __tablename__ = "posts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    text = db.Column(db.String(2555), nullable=True)
    img = db.Column(db.String(2555))
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=True
    )
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(tz=timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(tz=timezone.utc),
        onupdate=lambda: datetime.now(tz=timezone.utc),
    )

    # many to one
    user = db.relationship("User", back_populates="posts")
    # one to many
    comments = db.relationship(
        "Comment", back_populates="post", cascade="all, delete-orphan"
    )
    likes = db.relationship("Like", back_populates="post", cascade="all, delete-orphan")
    # many to many
    labels = db.relationship("Label", secondary=postlabel, back_populates="posts")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "text": self.text,
            "img": self.img,
            "user_id": self.user_id,
            "user": (
                {
                    # "id": self.user.id,
                    "username": self.user.username,
                }
                if self.user
                else None
            ),
            "comments": [comment.to_dict() for comment in self.comments] if self.comments else None,
            "likes": [like.to_dict() for like in self.likes] if self.likes else None,
            "labels": [label.to_dict() for label in self.labels] if self.labels else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
    
