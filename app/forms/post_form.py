from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DecimalField, SelectField
from wtforms.validators import Length

class PostForm(FlaskForm):
    # title = StringField(
    #     'title',
    #     validators=[
    #         Length(
    #             min=2,max=255, message='Title must be between 2 and 255 characters.'
    #         )
    #     ]
    # )
    text = StringField(
        'text',
        validators=[
            Length(
                min=2, max=5000, message='Text must be between 2 and 5000.'
            )
        ]
    )
    