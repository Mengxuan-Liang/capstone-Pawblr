from .db import db, environment, SCHEMA, add_prefix_for_prod
from .postlabel import postlabel

class Label(db.Model):
    __tablename__ = 'labels'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)

    # many to many
    posts = db.relationship(
        'Post',
        secondary=postlabel,
        back_populates='labels'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }