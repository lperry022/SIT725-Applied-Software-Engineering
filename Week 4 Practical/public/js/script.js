const challenges = [
  {
    title: "Suspicious Login",
    image: "images/login.png",
    hint: "Check for repeated failed login attempts followed by a success.",
    description: "Analyze the syslog to find how the attacker gained access."
  },
  {
    title: "Phishing Email",
    image: "images/email.png",
    hint: "Look at the email headers and links. Does the sender look legit?",
    description: "A user clicked on a fake invoice email — investigate it."
  }
];

const addCards = () => {
  const cardSection = document.getElementById("card-section");
  cardSection.innerHTML = ""; 
  challenges.forEach((item, index) => {
    const delayStyle = `style="--i:${index}"`;
    const cardHTML = `
      <div class="col s12 m6">
        <div class="card" ${delayStyle}>
          <div class="card-image">
            <img src="${item.image}" alt="${item.title}">
            <span class="card-title">${item.title}</span>
          </div>
          <div class="card-content">
            <p>${item.description}</p>
          </div>
          <div class="card-action">
            <a href="#" onclick="showHint(${index})">Show Hint</a>
          </div>
        </div>
      </div>
    `;
    cardSection.innerHTML += cardHTML;
  });
};

const showHint = (index) => {
  alert("AI Hint: " + challenges[index].hint);
};

document.addEventListener('DOMContentLoaded', addCards);
document.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
