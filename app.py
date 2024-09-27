from flask import Flask, request, render_template, url_for, redirect
from settings import SQLALCHEMY_DATABASE_URI
from flask_sqlalchemy import SQLAlchemy
from models import db, Form, Question, Choice, Response, QuestionType
from flask_migrate import Migrate
from dotenv import load_dotenv


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/formularioFlask'
app.config['SQLALCHEMY_DATABASE_URI'] =  SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)



@app.route("/", methods=["GET"])
def list_forms():
    forms = Form.query.all()
    return render_template('home.html', forms=forms)

@app.route("/forms/create", methods=["GET", "POST"])
def create_form():
    if request.method == "POST":
        data = request.form

        new_form = Form(title=data['title'], description=data['description'])
        db.session.add(new_form)
        db.session.commit() 

        questions_text = data.getlist('question_text[]')
        questions_type = data.getlist('question_type[]')

        choices_group = []
        for i in range(len(questions_text)):
            choices_key = f'choices_{i}[]'
            choices = data.getlist(choices_key)
            choices_group.append(choices)

        for i in range(len(questions_text)):
            question = Question(
                text=questions_text[i],
                question_type=questions_type[i],
                form_id=new_form.id  
            )
            db.session.add(question)
            
            if questions_type[i] in ['multiple_choice', 'checkbox']:
                choices = choices_group[i]
                for choice_text in choices:
                    if choice_text: 
                        choice = Choice(text=choice_text, question=question)
                        db.session.add(choice)

        db.session.commit()
        return redirect(url_for('main.list_forms'))

    return render_template('CriarForm.html')

@app.route("/forms/<int:form_id>", methods=["GET"])
def get_form(form_id):
    form = Form.query.get_or_404(form_id)
    if not form.questions:
        print("Nenhuma pergunta encontrada para este formulário.")
    return render_template('VisualizarForm.html', form=form, QuestionType=QuestionType)

@app.route("/forms/<int:form_id>/submit", methods=["GET", "POST"])
def submit_form_responses(form_id):
    form = Form.query.get_or_404(form_id)
    
    if request.method == "POST":
        data = request.form
        responses = []
        
        for question in form.questions:
            question_id = question.id  

            if question.question_type == QuestionType.SHORT_ANSWER:
                response_text = data.get(f'response_text_{question_id}')
                if response_text:  
                    responses.append(Response(
                        form_id=form_id,
                        question_id=question_id,
                        response_text=response_text,
                        choice_id=None
                    ))

            elif question.question_type == QuestionType.LONG_ANSWER:
                response_text = data.get(f'response_text_{question_id}')
                if response_text:  
                    responses.append(Response(
                        form_id=form_id,
                        question_id=question_id,
                        response_text=response_text,
                        choice_id=None
                    ))

            elif question.question_type == QuestionType.MULTIPLE_CHOICE:
                choice_id = data.get(f'choice_id_{question_id}')
                if choice_id:  
                    responses.append(Response(
                        form_id=form_id,
                        question_id=question_id,
                        response_text=None,
                        choice_id=choice_id
                    ))

            elif question.question_type == QuestionType.CHECKBOX:
                choice_ids = data.getlist(f'choice_ids_{question_id}')  
                for choice_id in choice_ids:
                    if choice_id:  
                        responses.append(Response(
                            form_id=form_id,
                            question_id=question_id,
                            response_text=None,
                            choice_id=choice_id
                        ))        

        if responses: 
            db.session.bulk_save_objects(responses)
            db.session.commit()
        else:
            print("nenhuma resposta foi salva")

        return redirect(url_for('main.list_forms'))

    return render_template('obterResposta.html', form=form, QuestionType=QuestionType)

@app.route("/forms/<int:form_id>/edit", methods=["GET", "POST"])
def edit_form(form_id):
    form = Form.query.get_or_404(form_id)

    if request.method == "POST":
        data = request.formf

        form.title = data['title']
        form.description = data['description']
        db.session.commit()

        new_questions_text = data.getlist('question_text[]')
        new_questions_type = data.getlist('question_type[]')

        choices_group = []
        for i in range(len(new_questions_text)):
            choices_key = f'choices_{i}[]'
            choices = data.getlist(choices_key)
            choices_group.append(choices)

        for i in range(len(new_questions_text)):
            new_question = Question(
                text=new_questions_text[i],
                question_type=new_questions_type[i],
                form_id=form.id  
            )
            db.session.add(new_question)

            if new_questions_type[i] in ['multiple_choice', 'checkbox']:
                new_choices = choices_group[i]
                for choice_text in new_choices:
                    if choice_text: 
                        new_choice = Choice(text=choice_text, question=new_question)
                        db.session.add(new_choice)

        db.session.commit()

        return redirect(url_for('main.get_form', form_id=form.id))

    existing_questions = Question.query.filter_by(form_id=form.id).all()

    return render_template('editarForm.html', form=form, questions=existing_questions, QuestionType=QuestionType)



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)

