const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection configuration
const mongoURI = "mongodb://localhost:27017"; // Change this to your MongoDB URI
const dbName = "querit"; // Change this to your database name
const client = new MongoClient(mongoURI, {
  // Omit useNewUrlParser and useUnifiedTopology options
});

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

// Route handler for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Fetch user from the database
  const user = await getUserFromDatabase(email, password);

  if (user) {
    // Login successful
    res.json({ message: "Login successful" });
  } else {
    // Login failed
    res
      .status(401)
      .json({ message: "Login failed. Incorrect email or password." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
