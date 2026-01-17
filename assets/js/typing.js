const text = "Automating AWS infrastructure, CI/CD pipelines & reliable systems";
const speed = 60;

let i = 0;
const target = document.getElementById("terminal-text");

function typeEffect() {
  if (i < text.length) {
    target.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, speed);
  }
}

typeEffect();
