from app.models import db, environment, SCHEMA, Label
from sqlalchemy.sql import text

def seed_labels():
    label1 = Label(
        name = 'label 1'
    )
    label2 = Label(
        name = 'label 2'
    )
    label3 = Label(
        name = 'label 3'
    )

    db.session.add_all([
        label1,
        label2,
        label3
    ])
    db.session.commit()

def undo_labels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.labels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM labels"))

    db.session.commit()