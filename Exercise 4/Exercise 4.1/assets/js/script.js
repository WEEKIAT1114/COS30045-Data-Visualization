/* =========================================================
   EnergyWise - JavaScript interactions
   - Current year
   - Responsive navigation
   - FAQ accordion
   - Appliance energy calculator
   No external libraries are used.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  setupMobileNavigation();
  setupFAQ();
  setupEnergyCalculator();
});

function setCurrentYear() {
  document.querySelectorAll(".year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function setupMobileNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuButton || !navLinks) return;

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });
}

function setupFAQ() {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((question, index) => {
    const answer = question.nextElementSibling;
    if (!answer || !answer.classList.contains("faq-answer")) return;

    const answerId = `faq-answer-${index + 1}`;
    answer.id = answerId;
    question.setAttribute("aria-controls", answerId);
    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";

      question.setAttribute("aria-expanded", String(!isOpen));
      answer.classList.toggle("open", !isOpen);
    });
  });
}

function setupEnergyCalculator() {
  const form = document.querySelector("#energyForm");
  const powerInput = document.querySelector("#power");
  const hoursInput = document.querySelector("#hours");
  const priceInput = document.querySelector("#price");
  const message = document.querySelector("#calculatorMessage");
  const results = document.querySelector("#results");

  if (!form || !powerInput || !hoursInput || !priceInput || !message || !results) {
    return;
  }

  function calculateAndDisplay(event) {
    if (event) event.preventDefault();

    const power = Number(powerInput.value);
    const hours = Number(hoursInput.value);
    const priceCents = Number(priceInput.value);

    const validationMessage = validateInputs(power, hours, priceCents);

    if (validationMessage) {
      message.textContent = validationMessage;
      results.innerHTML = `
        <h3>Your results</h3>
        <p>Please correct the highlighted input values before calculating.</p>
      `;
      return;
    }

    message.textContent = "";

    const dailyKWh = (power / 1000) * hours;
    const monthlyKWh = dailyKWh * 30;
    const yearlyKWh = dailyKWh * 365;
    const monthlyCost = monthlyKWh * (priceCents / 100);
    const yearlyCost = yearlyKWh * (priceCents / 100);

    results.innerHTML = `
      <h3>Your results</h3>
      <div class="result-list">
        ${resultRow("Daily energy", `${dailyKWh.toFixed(2)} kWh`)}
        ${resultRow("Monthly energy", `${monthlyKWh.toFixed(2)} kWh`)}
        ${resultRow("Yearly energy", `${yearlyKWh.toFixed(2)} kWh`)}
        ${resultRow("Estimated monthly cost", `$${monthlyCost.toFixed(2)}`)}
        ${resultRow("Estimated yearly cost", `$${yearlyCost.toFixed(2)}`)}
      </div>
      <p class="result-note">Estimate based on the values entered. Actual bills may include other tariffs and fees.</p>
    `;
  }

  form.addEventListener("submit", calculateAndDisplay);

  [powerInput, hoursInput, priceInput].forEach((input) => {
    input.addEventListener("input", () => {
      if (powerInput.value && hoursInput.value && priceInput.value) {
        calculateAndDisplay();
      }
    });
  });
}

function validateInputs(power, hours, priceCents) {
  if (!Number.isFinite(power) || power <= 0) {
    return "Please enter an appliance power greater than 0 watts.";
  }

  if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
    return "Daily usage must be between 0 and 24 hours.";
  }

  if (!Number.isFinite(priceCents) || priceCents < 0) {
    return "Electricity price must be 0 cents per kWh or higher.";
  }

  return "";
}

function resultRow(label, value) {
  return `
    <div class="result-item">
      <span class="result-label">${label}</span>
      <span class="result-value">${value}</span>
    </div>
  `;
}
