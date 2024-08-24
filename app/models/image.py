from .db import db, environment, SCHEMA, add_prefix_for_prod


class Image(db.Model):
    __tablename__ = 'images'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(500), nullable=True)

    # many to many
    # posts = db.relationship(
    #     'Post',
    #     secondary=postlabel,
    #     back_populates='labels'
    # )

    def to_dict(self):
        return {
            'id': self.id,
            'image': self.image
        }