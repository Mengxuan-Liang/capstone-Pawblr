from .db import db, environment, SCHEMA, add_prefix_for_prod

postlabel = db.Table(
    'postlabels',
    db.Column(
        'post_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('posts.id')),
        primary_key = True
    ),
    db.Column(
        'label_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('labels.id')),
        primary_key = True
    )
)

if environment == "production":
    postlabel.schema = SCHEMA