const jsonData = {
  count: 6,
  chinese: [
    {
      id: 0,
      character: "剪刀",
    },
    {
      id: 1,
      character: "背包",
    },
    {
      id: 2,
      character: "戒指",
    },
    {
      id: 3,
      character: "衣架",
    },
    {
      id: 4,
      character: "手指",
    },
    {
      id: 5,
      character: "键盘",
    },
  ],
  spanish: [
    {
      id: 0,
      character: "Tijeras",
    },
    {
      id: 1,
      character: "Mochila",
    },
    {
      id: 2,
      character: "Anillo",
    },
    {
      id: 3,
      character: "Percha",
    },
    {
      id: 4,
      character: "Dedo",
    },
    {
      id: 5,
      character: "Teclado",
    },
  ],
  chinese_voice: [
    {
      id: 0,
      audio_url: "path/to/voice/房子.mp3",
    },
    {
      id: 1,
      audio_url: "path/to/voice/朋友.mp3",
    },
    {
      id: 2,
      audio_url: "path/to/voice/吃.mp3",
    },
    {
      id: 3,
      audio_url: "path/to/voice/书.mp3",
    },
    {
      id: 4,
      audio_url: "path/to/voice/水.mp3",
    },
    {
      id: 5,
      audio_url: "path/to/voice/谢谢.mp3",
    },
  ],
  spanish_voice: [
    {
      id: 0,
      audio_url: "path/to/voice/casa.mp3",
    },
    {
      id: 1,
      audio_url: "path/to/voice/amigo_amiga.mp3",
    },
    {
      id: 2,
      audio_url: "path/to/voice/comer.mp3",
    },
    {
      id: 3,
      audio_url: "path/to/voice/libro.mp3",
    },
    {
      id: 4,
      audio_url: "path/to/voice/agua.mp3",
    },
    {
      id: 5,
      audio_url: "path/to/voice/gracias.mp3",
    },
  ],
  image: [
    {
      id: 0,
      image_url: "./scissors.jpg",
      description: "An image of a scissors",
    },
    {
      id: 1,
      image_url: "./backpack.jpg",
      description: "An image representing backpack",
    },
    {
      id: 2,
      image_url: "./ring.jpg",
      description: "An image showing ring",
    },
    {
      id: 3,
      image_url: "./hanger.jpg",
      description: "An image of a coast hanger",
    },
    {
      id: 4,
      image_url: "./finger.jpg",
      description: "An image of finger",
    },
    {
      id: 5,
      image_url: "./keyboard.jpg",
      description: "An image showing keyboard",
    },
  ],
};

let questionSequence;
let currentQuestionIndex = 0;
const rounds = 3; // Number of repeats

const questionsPerRound = jsonData.count; // Number of unique questions per round
const totalQuestions = rounds * questionsPerRound; // Total questions (18)

loadQuestion();

function generateQuestionSequence(data) {
  const baseQuestions = data.image.map((image, idx) => ({
    image_url: image.image_url,
    voice_url: data.chinese_voice.find((voice) => voice.id === image.id).audio_url,
    options: [
      data.chinese.find((item) => item.id === image.id),
      ...getRandomDistractors(data, image.id),
    ],
    correctAnswerId: image.id,
  }));

  questionSequence = [];
  for (let i = 0; i < rounds; i++) {
    const shuffledRound = shuffleWithNoConsecutiveDuplicates([...baseQuestions]);
    questionSequence = questionSequence.concat(shuffledRound);
  }
}

function shuffleWithNoConsecutiveDuplicates(array) {
  let shuffled = array.slice();
  let hasConsecutiveDuplicates = true;

  while (hasConsecutiveDuplicates) {
    shuffled.sort(() => Math.random() - 0.5);
    hasConsecutiveDuplicates = shuffled.some((item, idx) => 
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
    answerBtn.dataset.correct = answer.id === currentQuestion.correctAnswerId ? "true" : "false";
  });

  // Update question counter
  document.getElementById("question-counter").textContent = 
    `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;

  currentQuestionIndex++;
}

function endQuiz() {
  document.querySelector(".container").innerHTML = "<h2>Quiz Completed! Great job!</h2>";
}


function selectAnswer(index) {
  const selected = document.getElementById(`answer-${index}`);
  const feedback = document.getElementById("feedback");

  // Clear any previous feedback styling
  feedback.classList.remove("text-success", "text-danger");

  // Check if the selected answer is correct
  if (selected.dataset.correct === "true") {
    feedback.textContent = "✔️ Correct!";
    feedback.classList.add("text-success", "show");
    selected.classList.add("btn-success");
  } else {
    feedback.textContent = "❌ Incorrect!";
    feedback.classList.add("text-danger", "show");
    selected.classList.add("btn-danger");
  }

  // Hide incorrect answers and enlarge the correct one
  document.querySelectorAll(".answer").forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("large", "btn-success"); // Enlarge the correct answer
    } else {
      btn.style.display = "none"; // Hide incorrect answers
    }
  });

  // Display the next question button only after an answer is selected
  document.getElementById("next-button").style.display = "block";
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
