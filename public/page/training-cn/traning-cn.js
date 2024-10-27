const jsonData = JSON.parse(localStorage.getItem("jsonData"));
console.log(jsonData);

let questionSequence;
let currentQuestionIndex = 0;
const rounds = 3; // Number of repeats

const questionsPerRound = jsonData.count; // Number of unique questions per round
const totalQuestions = rounds * questionsPerRound; // Total questions (18)

loadQuestion();

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

function endQuiz() {
  document.querySelector(".container").innerHTML =
    "<h2>Quiz Completed! Great job!</h2>";

  sendEmail("chenzhesun@gmail.com", "Test", "This is a Test");
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

    // Display the "Next Question" button only if the answer is correct
    document.getElementById("next-button").style.display = "block";
  } else {
    feedback.textContent = "❌ Incorrect!";
    feedback.classList.add("text-danger", "show");
    selected.classList.add("btn-danger");

    // Hide the "Next Question" button if the answer is incorrect
    document.getElementById("next-button").style.display = "none";
  }

  // Hide incorrect answers and enlarge the correct one
  document.querySelectorAll(".answer").forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("large", "btn-success"); // Enlarge the correct answer
    } else {
      btn.style.display = "none"; // Hide incorrect answers
    }
  });
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

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// function sendEmail(to, subject, body) {
//   email = {
//     Host: "smtp.elasticemail.com",
//     Username: "fintrack.org@gmail.com",
//     Password: "BB9B071BADE2FE00348D246C41372184F4C4",
//     To: to,
//     From: "fintrack.org@gmail.com",
//     Subject: subject,
//     Body: body,
//     Port: "2525",
//   };
//   console.log(email);
//   Email.send(email)
//     .then(function (message) {
//       console.log(message);
//       alert("Mail has been sent successfully");
//     })
//     .catch(function (error) {
//       alert("Failed to send email: " + error);
//     });
// }

// const nodemailer = require('nodemailer');

// // Configure transporter using Elastic Email SMTP settings
// const transporter = nodemailer.createTransport({
//   host: 'smtp.elasticemail.com',
//   port: 2525, // or use 587
//   secure: false, // true for 465, false for other ports
//   auth: {
//     Username: "fintrack.org@gmail.com",
//     Password: "BB9B071BADE2FE00348D246C41372184F4C4",
//   },
//   API_Key:'96A9DB6981E926214D5816E594FC7D889FFC1F17AD86F178A6191299AE86BEC44245223A46C7F16DDBB3DECF0426D12E'
// });

async function sendEmail(to, subject, body) {
  const apiKey =
    "B2EB25A48C0E4E20A2C54A69CC0B36928D9566C279BBB771987D3DD9FCC85EA3F4E36A67F757EC61A696ED56A59C9D92";

  const emailData = {
    apikey: apiKey,
    to: to,
    subject: subject,
    from: "chenzhesun@gmail.com", // Replace with your verified sender email
    bodyHtml: body,
  };

  try {
    const response = await fetch("https://api.elasticemail.com/v2/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(emailData),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Email sent successfully:", result);
    } else {
      console.error("Failed to send email:", result);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

sendEmail("chenzhesun@gmail.com", "Test", "This is a Test");
BB22Z5338JZBX3SSAP1P3V9G