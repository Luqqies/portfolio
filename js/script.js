// JavaScript Document
const text = "Learn. Lead. Succeed.";
let index = 0;

function typeEffect() {
  if(index < text.length){
    document.getElementById("typing").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect, 80);
  }
}

typeEffect();
