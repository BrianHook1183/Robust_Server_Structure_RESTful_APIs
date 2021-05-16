const express = require("express");
const app = express();

const notes = require("./data/notes-data");

app.use(express.json());

app.get("/notes/:noteId", (req, res) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote === undefined) {
    res.status(400).send(`Note id not found: ${noteId}`);
  } else {
    res.json({ data: foundNote });
  }
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

// TODO: Add ability to create a new note
let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

app.post("/notes", (req, res, next) => {
  const { data: { text } = "" } = req.body;
  if (text) {
    const newNote = {
      id: ++lastNoteId, // Increment last id then assign as the current ID
      text,
    };
    notes.push(newNote);
    //  returns 201 when note is successfully created.
    res.status(201).json({ data: newNote });
    // The code above added a chained method call to .status(201) to change the status code from 200 (the default for success) to 201.
  } else {
    // return 400 if the text property is missing or empty.
    // call sendStatus() on the response to quickly set the response HTTP status code AND send its string representation as the response body.
    res.sendStatus(400);
  }
});

// TODO: add not found handler
// Not found handler
app.use((req, res, next) => {
  res.status(400).send(`Not found: ${req.originalUrl}`);
  next();
});

// TODO: Add error handler
// Error handler
app.use((error, req, res, next) => {
  res.sendStatus(400);
});

module.exports = app;
