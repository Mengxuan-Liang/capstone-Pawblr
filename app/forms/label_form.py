from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DecimalField, SelectField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Label

class LabelForm(FlaskForm):

    # def tag_exists(form, field):
    # # Checking if username is already in use
    #     name = field.data
    #     tag = Label.query.filter(Label.name == name).first()
    #     if tag:
    #         raise ValidationError('Tag is already exist.')
        

    name = StringField('text', validators=[Length(min=2, max=255, message='Tags must be between 2 and 255 charactors.')])