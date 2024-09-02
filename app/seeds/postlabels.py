from app.models import db, environment, SCHEMA, postlabel
from sqlalchemy.sql import text

def seed_postlabels():
    postlabel_entries = [
        {'post_id':1, 'label_id':8},
        {'post_id':1, 'label_id':10},
        {'post_id':2, 'label_id':9},
        {'post_id':2, 'label_id':5},
        {'post_id':3, 'label_id':6},
        {'post_id':4, 'label_id':9},
        {'post_id':5, 'label_id':4},
        {'post_id':6, 'label_id':1},
        {'post_id':7, 'label_id':2},
        {'post_id':7, 'label_id':3},
        {'post_id':8, 'label_id':7},
        {'post_id':8, 'label_id':5},
        {'post_id':9, 'label_id':6},
        {'post_id':9, 'label_id':9},
    ]

    for entry in postlabel_entries:
        db.session.execute(postlabel.insert().values(entry))
    db.session.commit()
def undo_postlabels():
    if environment == 'production':
        db.session.execute(
             f"TRUNCATE table {SCHEMA}.postlabels RESTART IDENTITY CASCADE;"
        )
    else:
         db.session.execute(text("DELETE FROM postlabels"))
    db.session.commit()