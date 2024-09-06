from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DecimalField, SelectField
from wtforms.validators import DataRequired, Length, NumberRange

class CommentForm(FlaskForm):
    text = StringField('text', validators=[Length(min=2, max=255, message='Comment must be between 2 and 255 charactors.')])