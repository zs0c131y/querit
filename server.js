const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection configuration
const mongoURI = "mongodb://localhost:27017"; // Change this to your MongoDB URI
const dbName = "querit"; // Change this to your database name
const client = new MongoClient(mongoURI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Connect to MongoDB
connectToMongoDB();

// Function to fetch a user from the database
async function getUserFromDatabase(email, password) {
  try {
    const db = client.db(dbName);
    const collection = db.collection("users");
    const user = await collection.findOne({ email: email, pass: password });
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err;
  }
}

// Route handler for the root path
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.post("/login", async (req, res) => {
  const { email, password, captchaInput, captchaResult } = req.body;

  console.log(`Received login request for email: ${email}`); // Debugging log

  // Simple email and password validation
  if (!email || !password) {
    console.log("Missing email or password."); // Debugging log
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Verify CAPTCHA response
  if (parseInt(captchaInput) !== parseInt(captchaResult)) {
    console.log("CAPTCHA verification failed."); // Debugging log
    return res.status(401).json({ message: "CAPTCHA verification failed." });
  }

  try {
    // Fetch user from the database
    const user = await getUserFromDatabase(email, password);

    if (user) {
      console.log("Login successful."); // Debugging log
      // Login successful, redirect to home.html
      res.redirect("/home.html");
    } else {
      console.log("Login failed. Incorrect email or password."); // Debugging log
      // Login failed
      res
        .status(401)
        .json({ message: "Login failed. Incorrect email or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
