from .db import db, environment,SCHEMA, add_prefix_for_prod
from .user import User

class Message(db.Model):
    __tablename__ = 'message'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    content = db.Column(db.Text, nullable=False)
    room = db.Column(db.String(120), nullable=False)