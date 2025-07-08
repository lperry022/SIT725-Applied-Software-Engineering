# Express Calculator API

This project is a simple calculator built with Node.js and Express. It supports basic arithmetic operations using HTTP GET requests and returns results in a styled HTML format.

## How to Run

1. Clone the repository:
git clone https://github.com/your-username/your-repo-name.git


2. Navigate to the project folder:
cd your-repo-name

3. Install dependencies:
npm install

4. Start the server:
node server.js

5. Open your browser and go to:
http://localhost:3000


## Available Operations

You can perform the following operations by visiting these URLs:

- Add: `/add?num1=10&num2=5`
- Subtract: `/subtract?num1=10&num2=5`
- Multiply: `/multiply?num1=10&num2=5`
- Divide: `/divide?num1=10&num2=5`

Each operation returns a styled HTML page showing the result.

## File Structure

- `server.js` – main server file with all routes
- `public/index.html` – home page with links to operations
- `README.md` – project instructions

## Author

Liana Perry – Master of Cybersecurity