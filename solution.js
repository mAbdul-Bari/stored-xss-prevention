import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

// Array to store submitted messages
let messages = [];

// Regex patterns for input validation
const nameRegex = /^[a-zA-Z\s]{2,30}$/;
const emailRegex = /^[^<>;\s]+@[^\s@<>;]+\.[^\s@<>;]+$/;
const subjectRegex = /^[a-zA-Z\d\s]{5,100}$/;
const messageRegex = /^[a-zA-Z\d\s]{10,500}$/;

// Route to handle form submission
app.post('/submit', (req, res) => {
    // Extract form data
    const { name, email, subject, message } = req.body;
  
    // Validate input
    if (!nameRegex.test(name) || !emailRegex.test(email) || !subjectRegex.test(subject) || !messageRegex.test(message)) {
      // If input is invalid, send an alert
      return res.status(400).send(`
        <script>
          alert('Invalid input data. Please check your inputs.');
          window.history.back();
        </script>
      `);
    }
  
    // Store the submitted message
    messages.push({ name, email, subject, message });
  
    // Send success response
    res.status(200).sendFile(__dirname + "/inner-page.html");
});

// Serve the form HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
