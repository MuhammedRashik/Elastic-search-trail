// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");
const elasticClient = require("./elastic-client");
require("express-async-errors");

const app = express();

app.use(express.json());

// Routes for user operations
app.post("/create-user", async (req, res) => {
  const { id, username, profileUrl, followers, following } = req.body;

  // Basic input validation
  if (!id || !username) {
    return res.status(400).json({ error: "ID and username are required." });
  }

  try {
    const result = await elasticClient.index({
      index: "users",
      body: {
        id,
        username,
        profileUrl,
        followers,
        following,
      },
    });

    res.json(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/get-user", async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const result = await elasticClient.get({
      index: "users",
      id: userId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Other routes for update and delete user similar to the above GET route...

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(8000, () => console.log("Server is running"));
