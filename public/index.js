function startTraining() {
  const userName = document.getElementById("username").value.trim();

  if (userName) {
    // Redirect to quiz.html with user's name as a query parameter
    localStorage.setItem("jsonData", JSON.stringify(jsonData));
    window.location.href = `./page/training-cn/traning-cn.html?name=${encodeURIComponent(userName)}`;
  } else {
    alert("Please enter your name to start the training.");
  }
}

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
      image_url: "../../image/scissors.jpg",
      description: "An image of a scissors",
    },
    {
      id: 1,
      image_url: "../../image/backpack.jpg",
      description: "An image representing backpack",
    },
    {
      id: 2,
      image_url: "../../image/ring.jpg",
      description: "An image showing ring",
    },
    {
      id: 3,
      image_url: "../../image/hanger.jpg",
      description: "An image of a coast hanger",
    },
    {
      id: 4,
      image_url: "../../image/finger.jpg",
      description: "An image of finger",
    },
    {
      id: 5,
      image_url: "../../image/keyboard.jpg",
      description: "An image showing keyboard",
    },
  ],
};