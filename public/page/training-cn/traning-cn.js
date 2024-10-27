const jsonData = JSON.parse(localStorage.getItem("jsonData"));
console.log(jsonData);

// Initialize counters for correct and incorrect answers and an array to store wrong answers
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
let wrongAnswers = []; // Array to store details of incorrect answers
let questionSequence;
let currentQuestionIndex = 0;
const rounds = 3; // Number of repeats

const questionsPerRound = jsonData.count; // Number of unique questions per round
const totalQuestions = rounds * questionsPerRound; // Total questions (18)

loadQuestion();

// Modify the selectAnswer function to track the user's performance and store wrong answers
function selectAnswer(index) {
  const selected = document.getElementById(`answer-${index}`);
  const feedback = document.getElementById("feedback");

  // Clear any previous feedback styling
  feedback.classList.remove("text-success", "text-danger");

  const currentQuestion = questionSequence[currentQuestionIndex - 1];

  // Check if the selected answer is correct
  if (selected.dataset.correct === "true") {
    feedback.textContent = "✔️ Correct!";
    feedback.classList.add("text-success", "show");
    selected.classList.add("btn-success");
    correctAnswersCount++; // Increment correct answers count
    document.getElementById("next-button").style.display = "block";
  } else {
    feedback.textContent = "❌ Incorrect!";
    feedback.classList.add("text-danger", "show");
    selected.classList.add("btn-danger");
    incorrectAnswersCount++; // Increment incorrect answers count

    // Store details of the incorrect answer
    const selectedOption = selected.textContent;
    const correctOption = currentQuestion.options.find(
      (option) => option.id === currentQuestion.correctAnswerId
    ).character;

    wrongAnswers.push({
      questionImage: currentQuestion.image_url,
      selectedAnswer: selectedOption,
      correctAnswer: correctOption,
    });

    document.getElementById("next-button").style.display = "none";
  }

  // Hide incorrect answers and enlarge the correct one
  document.querySelectorAll(".answer").forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("large", "btn-success");
    } else {
      btn.style.display = "none";
    }
  });
}

// Modify endQuiz function to display statistics and list of incorrect answers
function endQuiz() {
  const totalQuestionsAnswered = correctAnswersCount + incorrectAnswersCount;
  const accuracy = (
    (correctAnswersCount / totalQuestionsAnswered) *
    100
  ).toFixed(2);

  // Display overall statistics
  let summaryHtml = `
    <h2>Quiz Completed! Great job!</h2>
    <p><strong>Statistics:</strong></p>
    <ul>
      <li>Total Questions: ${totalQuestionsAnswered}</li>
      <li>Correct Answers: ${correctAnswersCount}</li>
      <li>Incorrect Answers: ${incorrectAnswersCount}</li>
      <li>Accuracy: ${accuracy}%</li>
    </ul>
  `;

  // Display detailed incorrect answers if any
  if (wrongAnswers.length > 0) {
    summaryHtml += `<h3>Incorrect Answers Summary:</h3><ul>`;
    wrongAnswers.forEach((item, index) => {
      summaryHtml += `
        <li>
          <p><strong>Question ${index + 1}:</strong></p>
          <img src="${item.questionImage}" alt="Question Image" width="200">
          <p>Your Answer: ${item.selectedAnswer}</p>
          <p>Correct Answer: ${item.correctAnswer}</p>
        </li>
      `;
    });
    summaryHtml += `</ul>`;
  }

  document.querySelector(".container").innerHTML =
    "<h2>Training Completed! Great job!</h2>";

  // Optionally, send an email with statistics and incorrect answers
  sendEmail(
    "chenzhesun@gmail.com",
    "Training Statistics for " + localStorage.getItem('username'),
    `Total Questions: ${totalQuestionsAnswered}\nCorrect Answers: ${correctAnswersCount}\nIncorrect Answers: ${incorrectAnswersCount}\nAccuracy: ${accuracy}%\n\nIncorrect Answers:\n${wrongAnswers
      .map(
        (item, index) =>
          `Question ${index + 1} - Your Answer: ${
            item.selectedAnswer
          }, Correct Answer: ${item.correctAnswer}`
      )
      .join("\n")}`
  );

  // Initialize counters for correct and incorrect answers and an array to store wrong answers
  correctAnswersCount = 0;
  incorrectAnswersCount = 0;
  wrongAnswers = []; // Array to store details of incorrect answers
  questionSequence = null;
  currentQuestionIndex = 0;
  rounds = 3; // Number of repeats

  questionsPerRound = jsonData.count; // Number of unique questions per round
  totalQuestions = rounds * questionsPerRound; // Total questions (18)
}

function generateQuestionSequence(data) {
  const baseQuestions = data.image.map((image, idx) => ({
    image_url: image.image_url,
    voice_url: data.chinese_voice.find((voice) => voice.id === image.id)
      .audio_url,
    options: [
      data.chinese.find((item) => item.id === image.id),
      ...getRandomDistractors(data, image.id),
    ],
    correctAnswerId: image.id,
  }));

  questionSequence = [];
  for (let i = 0; i < rounds; i++) {
    const shuffledRound = shuffleWithNoConsecutiveDuplicates([
      ...baseQuestions,
    ]);
    questionSequence = questionSequence.concat(shuffledRound);
  }
}

function shuffleWithNoConsecutiveDuplicates(array) {
  let shuffled = array.slice();
  let hasConsecutiveDuplicates = true;

  while (hasConsecutiveDuplicates) {
    shuffled.sort(() => Math.random() - 0.5);
    hasConsecutiveDuplicates = shuffled.some(
      (item, idx) =>
        idx > 0 && item.correctAnswerId === shuffled[idx - 1].correctAnswerId
    );
  }
  return shuffled;
}

function loadQuestion() {
  if (!questionSequence) {
    generateQuestionSequence(jsonData);
  }

  if (currentQuestionIndex >= totalQuestions) {
    endQuiz();
    return;
  }

  const currentQuestion = questionSequence[currentQuestionIndex];
  document.getElementById("quiz-image").src = currentQuestion.image_url;
  document.getElementById("audio").src = currentQuestion.voice_url;

  const answers = [...currentQuestion.options];
  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer, i) => {
    const answerBtn = document.getElementById(`answer-${i}`);
    answerBtn.textContent = answer.character;
    answerBtn.dataset.correct =
      answer.id === currentQuestion.correctAnswerId ? "true" : "false";
  });

  // Update question counter
  document.getElementById("question-counter").textContent = `Question ${
    currentQuestionIndex + 1
  } of ${totalQuestions}`;

  currentQuestionIndex++;
}

function nextQuestion() {
  // Reset feedback text and hide the next button
  const feedback = document.getElementById("feedback");
  feedback.classList.remove("text-success", "text-danger", "show");
  feedback.textContent = "";

  // Reset button styles for the answers
  document.querySelectorAll(".answer").forEach((btn) => {
    btn.classList.remove("btn-success", "btn-danger", "large");
    btn.classList.add("btn-secondary"); // Reset to default color
    btn.style.display = "inline-block"; // Make all buttons visible again
  });

  // Hide the next question button
  document.getElementById("next-button").style.display = "none";

  // Load the next question
  loadQuestion();
}

function getRandomQuestion(data) {
  const index = Math.floor(Math.random() * data.image.length);
  const image = data.image[index];

  return {
    image_url: image.image_url,
    voice_url: data.chinese_voice.find((voice) => voice.id === image.id)
      .audio_url,
    options: [
      data.chinese.find((item) => item.id === image.id),
      ...getRandomDistractors(data, image.id),
    ],
    correctAnswerId: image.id,
  };
}

function getRandomDistractors(data, correctId) {
  const distractors = data.chinese.filter((item) => item.id !== correctId);
  return distractors.sort(() => Math.random() - 0.5).slice(0, 3);
}

async function sendEmail(to, subject, body) {
  (function () {
    emailjs.init("U09aG2P91J7xxoRzz");
  })();
  const serviceID = "service_dfrmtyb";
  const templateID = "template_q0i8rr2";

  const emailData = {
    to: to,
    subject: subject,
    from: "chenzhesun@gmail.com",
    message: body,
  };

  emailjs.send(serviceID, templateID, emailData).then(
    function (response) {
      console.log("Email sent:", response.status, response.text);
    },
    function (error) {
      alert("Failed to send email. Please try again.");
      console.error("Failed to send email:", error);
    }
  );
}
