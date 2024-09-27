from flask_sqlalchemy import SQLAlchemy
import enum

db = SQLAlchemy()


class QuestionType(enum.Enum):
    SHORT_ANSWER = 'short_answer'
    LONG_ANSWER = 'long_answer'
    MULTIPLE_CHOICE = 'multiple_choice'
    CHECKBOX = 'checkbox'

class Form(db.Model):
    __tablename__ = 'forms'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)  
    description = db.Column(db.Text, nullable=True)    

    questions = db.relationship('Question', backref='form', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'questions': [question.to_dict() for question in self.questions],
        }

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False) 
    question_type = db.Column(db.Enum(QuestionType), nullable=False) 

    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)

    choices = db.relationship('Choice', backref='question', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'question_type': self.question_type.value,
            'choices': [choice.to_dict() for choice in self.choices],
        }

class Choice(db.Model):
    __tablename__ = 'choices'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False) 
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
        }

class Response(db.Model):
    __tablename__ = 'responses'
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('forms.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)

    response_text = db.Column(db.Text, nullable=True) 
    choice_id = db.Column(db.Integer, db.ForeignKey('choices.id'), nullable=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'question_id': self.question_id,
            'response_text': self.response_text,
            'choice_id': self.choice_id,
        }