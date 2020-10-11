// Dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");

// Express App
const app = express();
var PORT = 3000;

// JSON data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Get notes
app.get("/api/notes", (req, res) => {
  return res.json(readDB());
});

// Post notes
app.post("/api/notes", (req, res) => {
  const notes = readDB();
  req.body.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  notes.push(req.body);
  writeDB(notes);
  res.json(notes);
});

// Delete note
app.delete("/api/notes/:id", (req, res) => {
  const newNotes = readDB().filter(note => note.id != req.params.id);
  writeDB(newNotes);
  res.json(newNotes);
});

// Read JSON function
const readDB = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json")));;
};

// Write JSON function
const writeDB = (data) => {
  fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(data), (err) => {
    if (err) throw err;
  });
};

// Start server
app.listen(PORT, () => {
  console.log("Listening on PORT " + PORT);
});
