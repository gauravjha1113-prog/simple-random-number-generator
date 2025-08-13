let frequency = {}; // store counts of each number
let minInput, maxInput, decimalCheckbox;
let currentNumber = null;
let animStartTime = 0;
let animDuration = 500; // animation time in ms
let history = []; // store generated numbers
let historyLimit = 40; // max numbers in history

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupUI();
}

function draw() {
  background(255);

  // Draw histogram on left
  drawHistogram();

  // Labels
  fill(255, 0, 0);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("MinVal", 90, 120);
  text("MaxVal", 287, 120);

  // Title
  textAlign(CENTER, CENTER);
  textSize(40);
  text("Simple number maker!!!", width / 2, 80);

  // Check box label
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Decimal", width / 2, 900);

  // Show instructions or animated number
  if (currentNumber === null) {
    text("Click to generate a number", width / 2, height / 2 + 80);
  } else {
    let elapsed = millis() - animStartTime;
    let progress = constrain(elapsed / animDuration, 0, 1);
    let scaleFactor = lerp(0.2, 1, progress);

    textSize(70 * scaleFactor);
    text(currentNumber, width / 2, height / 2);

    if (progress >= 1) {
      textSize(40);
      text("Click to generate another number", width / 2, height / 2 + 80);
    }
  }

  // Draw history on the right side
  drawHistory();
}

function drawHistogram() {
  let keys = Object.keys(frequency).sort((a, b) => parseFloat(a) - parseFloat(b));
  if (keys.length === 0) return;

  let maxCount = Math.max(...Object.values(frequency));
  let barWidth = 30;
  let chartHeight = 200;

  push();
  translate(50, 1170 - chartHeight / 2); // left side position

  fill(0);
  textSize(14);
  text("Frequency Histogram (50 Number Limit)", 0, -20);

  for (let i = 0; i < keys.length; i++) {
    let num = keys[i];
    let count = frequency[num];
    let barHeight = map(count, 0, maxCount, 0, chartHeight);

    fill(100, 150, 255);
    rect(i * (barWidth + 5), chartHeight - barHeight, barWidth, barHeight);

    fill(0);
    textAlign(CENTER, TOP);
    text(num, i * (barWidth + 5) + barWidth / 2, chartHeight + 5);
  }
  pop();
}

function mouseClicked() {
  let minVal = int(minInput.value());
  let maxVal = int(maxInput.value());

  if (minVal >= maxVal) {
    alert('Minimum must be less than maximum!');
    return;
  }

  let isDecimal = decimalCheckbox.checked();

  if (isDecimal) {
    currentNumber = random(minVal, maxVal).toFixed(2); // 2 decimal places
  } else {
    currentNumber = int(random(minVal, maxVal + 1));
  }
  animStartTime = millis();

  // Add number to history
  history.unshift(currentNumber);
  if (history.length > historyLimit) {
    history.pop();
  }

  // Rebuild frequency from history so old numbers drop off
  frequency = {};
  for (let num of history) {
    frequency[num] = (frequency[num] || 0) + 1;
  }
}

function drawHistory() {
  textAlign(LEFT, TOP);
  textSize(20);
  fill(0);
  text("History:", width - 200, 120);

  for (let i = 0; i < history.length; i++) {
    text(history[i], width - 200, 150 + i * 25);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setupUI() {
  let inputX = 140;
  let inputY = 110;

  minInput = createInput('1');
  minInput.position(inputX, inputY);
  minInput.size(50);

  maxInput = createInput('20');
  maxInput.position(inputX + 200, inputY);
  maxInput.size(50);

  // Create checkbox for decimal
  decimalCheckbox = createCheckbox('', false);
  decimalCheckbox.position(width / 2 + 40, 890); // Adjust as needed
}
