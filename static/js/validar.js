const createForm = document.getElementById("createForm");
const editForm = document.getElementById("editForm");
const formResponse = document.getElementById("formResponse");

if (createForm) {
  createForm.addEventListener("submit", validateCreateForm);
}

if (editForm) {
  editForm.addEventListener("submit", validateEditForm);
}

if (formResponse) {
  formResponse.addEventListener("submit", validateFormResponse);
}

function validateCreateForm(event) {
  const titleInput = document.getElementById("title");
  const titleError = document.getElementById("titleError");
  const questionsContainer = document.getElementById("questionsContainer");
  const questions =
    questionsContainer.getElementsByClassName("question-content");

  titleError.style.display = "none";
  titleInput.classList.remove("text-error");

  if (titleInput.value.length > 200) {
    event.preventDefault();
    titleError.style.display = "block";
    titleInput.classList.add("text-error");
  }

  if (questions.length === 0) {
    event.preventDefault();
    alert("Você deve adicionar pelo menos uma pergunta ao formulário");
  }
}

function validateEditForm(event) {
  const titleInput = document.getElementById("title");
  const titleError = document.getElementById("titleError");

  titleError.style.display = "none";
  titleInput.classList.remove("text-error");

  if (titleInput.value.length > 200) {
    event.preventDefault();
    titleError.style.display = "block";
    titleInput.classList.add("text-error");
  }
}

function validateFormResponse(event) {
    const shortAnswerInputs = document.querySelectorAll('.short-answer');
    let isValid = true;
    shortAnswerInputs.forEach(input => {
        const titleError = input.nextElementSibling; 

        titleError.style.display = "none";
        input.classList.remove("text-error");

        if (input.value.length > 200) {
            event.preventDefault();
            titleError.style.display = "block";
            input.classList.add("text-error");
            isValid = false;
        }
    });
    if (!isValid) {
        event.preventDefault(); 
    }
}