var express = require("express")
const path = require('path');
var app = express()
var port = process.env.port || 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// In-memory array to store quotes
let quotes = [
  "The best way to predict the future is to invent it.",
  "Life is 10% what happens to us and 90% how we react to it.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Do not wait to strike till the iron is hot; but make it hot by striking."
];

app.get('/api/quote', (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.json({ quote: quotes[randomIndex] });
});


app.post('/api/quote', (req, res) => {
  const { quote } = req.body;
  if (!quote || typeof quote !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid quote.' });
  }
  quotes.push(quote);
  res.json({ message: 'Quote added successfully.', quotes });
});

app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});