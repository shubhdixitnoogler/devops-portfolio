const text = "I design and automate CI/CD pipelines, containerized deployments, and cloud infrastructure to reduce manual effort, improve deployment reliability, and support production-ready systems.";
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
