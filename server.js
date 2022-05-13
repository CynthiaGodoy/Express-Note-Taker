//CALLING THE SERVER FOR EXPRESS & FS MODULE | REQUIRE DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");

// SET UP EXPRESS APP TO READ ON PORT 3001
const app = express(); //SENDING VARIABLE TO EXPRESS FUNCTION
const PORT = process.env.PORT || 3001; //SETTING UP THE PORT FOR HEROKU

// SET UP EXPRESS TO USE DATA PARSING
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); //MIDDLEWARE TO SERVE STATIC ASSETS TO FRONT-END
let notes = require("./db/db.json"); //

// ROUTE THAT RETURN DATA TO THE NOTES.HTML
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// DISPLAY NOTES (REQUEST & RESPONSE) | READS DB.JSON FILE AND RETURNS NOTES AS JSON
app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) {
        console.log(err);
        return;
        }
    res.json(notes);
    });
});

// STARTS SERVER TO BEGIN LISTENING | LIVING ON THE BACK-END ONLY
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

// CREATE NEW NOTE & LOGS THE NOTE IS SAVED TO THE DB FILE
app.post("/api/notes", function (req, res) {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let id = randLetter + Date.now();
    let newNote = {
        id: id,
        title: req.body.title,
        text: req.body.text,
    };
        console.log(typeof notes);
        notes.push(newNote);
        const stringifyNote = JSON.stringify(notes);
        res.json(notes);
        fs.writeFile("db/db.json", stringifyNote, (err) => {
            if (err) console.log(err);
            else {
            console.log("api note successfully saved to db.json");
            }
            });
});

// DELETE NOTE | QUERY PARAMETER THAT CONTAINS THE ID OF NOTE | PARAMS RETURNS A TERM
app.delete("/api/notes/:id", function (req, res) {
    let noteID = req.params.id;
    fs.readFile("db/db.json", "utf8", function (err, data) {
    let updatedNotes = JSON.parse(data).filter((note) => {
        console.log("note.id", note.id);
        console.log("noteID", noteID);
        return note.id !== noteID;
        });
    notes = updatedNotes;
    const stringifyNote = JSON.stringify(updatedNotes);
    fs.writeFile("db/db.json", stringifyNote, (err) => {
        if (err) console.log(err);
        else {
            console.log("api note successfully deleted from db.json");
        }
    });
    res.json(stringifyNote);
    });
});

// CATCH ERRORS
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});