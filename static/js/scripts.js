let questionIndex = document.querySelectorAll('#questionsContainer .question-content').length;

const addQuestionButton = document.getElementById('addQuestion');
addQuestionButton.addEventListener('click', () => {
    addQuestion();
});

document.getElementById('questionsContainer').addEventListener('change', (event) => {
    if (event.target.classList.contains('question-type')) {
        handleQuestionTypeChange(event.target);
    }
});

document.getElementById('questionsContainer').addEventListener('click', (event) => {
    if (event.target.classList.contains('add-choice')) {
        handleAddChoice(event.target);
    } else if (event.target.classList.contains('remove-choice')) {
        handleRemoveChoice(event.target);
    } else if (event.target.classList.contains('remove-question')) {
        handleRemoveQuestion(event.target);
    }
});

function addQuestion() { 
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-content');
    questionItem.setAttribute('data-question-index', questionIndex);

    const formGroupQuestion = document.createElement('div');
    formGroupQuestion.classList.add('content');
    
    const labelQuestion = document.createElement('label');
    labelQuestion.setAttribute('for', 'questionText');
    labelQuestion.textContent = 'Pergunta';
    
    const inputQuestion = document.createElement('input');
    inputQuestion.type = 'text';
    inputQuestion.classList.add('question-text');
    inputQuestion.name = 'question_text[]';
    inputQuestion.required = true;

    formGroupQuestion.appendChild(labelQuestion);
    formGroupQuestion.appendChild(inputQuestion);

    const formGroupType = document.createElement('div');
    formGroupType.classList.add('content');

    const labelType = document.createElement('label');
    labelType.setAttribute('for', 'questionType');
    labelType.textContent = 'Tipo de Pergunta';

    const selectType = document.createElement('select');
    selectType.classList.add('question-type');
    selectType.name = 'question_type[]';

    const optionShort = document.createElement('option');
    optionShort.value = 'short_answer';
    optionShort.textContent = 'Resposta Curta';

    const optionLong = document.createElement('option');
    optionLong.value = 'long_answer';
    optionLong.textContent = 'Resposta Longa';

    const optionMultiple = document.createElement('option');
    optionMultiple.value = 'multiple_choice';
    optionMultiple.textContent = 'Múltipla Escolha';

    const optionCheckbox = document.createElement('option');
    optionCheckbox.value = 'checkbox';
    optionCheckbox.textContent = 'Caixa de Seleção';

    selectType.appendChild(optionShort);
    selectType.appendChild(optionLong);
    selectType.appendChild(optionMultiple);
    selectType.appendChild(optionCheckbox);

    formGroupType.appendChild(labelType);
    formGroupType.appendChild(selectType);

    const formGroupChoices = document.createElement('div');
    formGroupChoices.classList.add('content', 'choices-container');
    formGroupChoices.style.display = 'none';

    const labelChoices = document.createElement('label');
    labelChoices.setAttribute('for', 'choices');
    labelChoices.textContent = 'Alternativas';

    const choicesDiv = document.createElement('div');
    choicesDiv.classList.add('choices');

    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group');

    const choiceInput = document.createElement('input');
    choiceInput.type = 'text';
    choiceInput.classList.add('choice-text');
    choiceInput.name = `choices_${questionIndex}[]`;
    choiceInput.placeholder = 'Alternativa';

    const inputGroupAppend = document.createElement('div');
    inputGroupAppend.classList.add('input-group-append');

    const removeChoiceButton = document.createElement('button');
    removeChoiceButton.type = 'button';
    removeChoiceButton.classList.add('remove-choice');
    removeChoiceButton.textContent = 'Remover';

    inputGroupAppend.appendChild(removeChoiceButton);
    inputGroup.appendChild(choiceInput);
    inputGroup.appendChild(inputGroupAppend);
    choicesDiv.appendChild(inputGroup);

    const addChoiceButton = document.createElement('button');
    addChoiceButton.type = 'button';
    addChoiceButton.classList.add('add-choice');
    addChoiceButton.textContent = 'Adicionar Alternativa';

    formGroupChoices.appendChild(labelChoices);
    formGroupChoices.appendChild(choicesDiv);
    formGroupChoices.appendChild(addChoiceButton);

    const removeQuestionButton = document.createElement('button');
    removeQuestionButton.type = 'button';
    removeQuestionButton.classList.add('remove-question');
    removeQuestionButton.textContent = 'Remover Pergunta';

    questionItem.appendChild(formGroupQuestion);
    questionItem.appendChild(formGroupType);
    questionItem.appendChild(formGroupChoices);
    questionItem.appendChild(removeQuestionButton);

    document.getElementById('questionsContainer').appendChild(questionItem);
    questionIndex++; 
}

function handleQuestionTypeChange(selectElement) {
    const questionItem = selectElement.closest('.question-content');
    const questionType = selectElement.value;
    const choicesContainer = questionItem.querySelector('.choices-container');

    choicesContainer.style.display = 'none';  
    const choicesDiv = choicesContainer.querySelector('.choices');
    choicesDiv.innerHTML = '';

    if (questionType === 'multiple_choice' || questionType === 'checkbox') {
        choicesContainer.style.display = 'block';  
    }
}

function handleAddChoice(buttonElement) {
    const questionItem = buttonElement.closest('.question-content');
    const questionIndex = questionItem.getAttribute('data-question-index');

    const choiceItem = document.createElement('div');
    choiceItem.classList.add('input-group');

    const choiceInput = document.createElement('input');
    choiceInput.type = 'text';
    choiceInput.classList.add('choice-text');
    choiceInput.name = `choices_${questionIndex}[]`;
    choiceInput.placeholder = 'Alternativa';
    choiceInput.required = true;
    
    const inputGroupAppend = document.createElement('div');
    inputGroupAppend.classList.add('input-group-append');

    const removeChoiceButton = document.createElement('button');
    removeChoiceButton.type = 'button';
    removeChoiceButton.classList.add('remove-choice');
    removeChoiceButton.textContent = 'Remover';

    inputGroupAppend.appendChild(removeChoiceButton);

    choiceItem.appendChild(choiceInput);
    choiceItem.appendChild(inputGroupAppend);

    const choicesDiv = questionItem.querySelector('.choices');

    choicesDiv.appendChild(choiceItem);
}

function handleRemoveChoice(buttonElement) {
    const choiceItem = buttonElement.closest('.input-group');
    choiceItem.remove();
}

function handleRemoveQuestion(buttonElement) {
    const questionItem = buttonElement.closest('.question-content');
    questionItem.remove();
}