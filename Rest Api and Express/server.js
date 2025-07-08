const express = require('express');
const app = express();

app.use(express.static('public'));

function parseNumbers(req, res) {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
    res.status(400).send(`<p style="color:red; font-family:sans-serif;">Both num1 and num2 must be valid numbers.</p>`);
    return null;
  }

  return { num1, num2 };
}

function renderPage(title, expression, result) {
  return `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 100px;
            background-color: #f0f0f5;
          }
          .box {
            background: white;
            display: inline-block;
            padding: 30px 40px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #007bff;
          }
          p {
            font-size: 20px;
          }
          a {
            text-decoration: none;
            color: #333;
            display: block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>${title}</h1>
          <p>${expression} = <strong>${result}</strong></p>
          <a href="/">Back to Home</a>
        </div>
      </body>
    </html>
  `;
}

app.get('/add', (req, res) => {
  const nums = parseNumbers(req, res);
  if (!nums) return;
  const result = nums.num1 + nums.num2;
  res.send(renderPage('Addition Result', `${nums.num1} + ${nums.num2}`, result));
});

app.get('/subtract', (req, res) => {
  const nums = parseNumbers(req, res);
  if (!nums) return;
  const result = nums.num1 - nums.num2;
  res.send(renderPage('Subtraction Result', `${nums.num1} - ${nums.num2}`, result));
});

app.get('/multiply', (req, res) => {
  const nums = parseNumbers(req, res);
  if (!nums) return;
  const result = nums.num1 * nums.num2;
  res.send(renderPage('Multiplication Result', `${nums.num1} × ${nums.num2}`, result));
});

app.get('/divide', (req, res) => {
  const nums = parseNumbers(req, res);
  if (!nums) return;
  if (nums.num2 === 0) {
    return res.status(400).send(renderPage('Division Error', `Cannot divide ${nums.num1} by 0`, 'Undefined'));
  }
  const result = nums.num1 / nums.num2;
  res.send(renderPage('Division Result', `${nums.num1} ÷ ${nums.num2}`, result));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
