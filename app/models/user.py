from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .follow import follow


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    profileImage = db.Column(db.String(500))
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    # one to many
    posts = db.relationship('Post', back_populates='user')
    likes = db.relationship('Like', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')
    # many to many
    following = db.relationship(
        'User',
        secondary=follow,
        primaryjoin=(follow.c.follower_id == id),
        secondaryjoin=(follow.c.followee_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profileImage': self.profileImage
        }
