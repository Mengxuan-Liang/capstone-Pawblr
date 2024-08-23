from app.models import db, environment, SCHEMA, Label
from sqlalchemy.sql import text

def seed_labels():
    label1 = Label(
        name = 'Love'
    )
    label2 = Label(
        name = 'Death'
    )
    label3 = Label(
        name = 'Nature'
    )
    label4 = Label(
        name = 'Time'
    )
    label5 = Label(
        name = 'Identity and Self'
    )
    label6 = Label(
        name = 'Society and Social Issues'
    )
    label7 = Label(
        name = 'Isolation and Loneliness'
    )
    label8 = Label(
        name = 'Hope and Despair'
    )
    label9 = Label(
        name = 'Journey and Exploration'
    )
    label10 = Label(
        name = 'Power and Corruption'
    )

    db.session.add_all([
        label1,
        label2,
        label3,
        label4,
        label5,
        label6,
        label7,
        label8,
        label9,
        label10
    ])
    db.session.commit()

def undo_labels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.labels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM labels"))

    db.session.commit()