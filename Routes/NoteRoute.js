import express from "express";
import { AUTHENTICATE_USER } from "../Middleware/AUTHENTIC_USER.js";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getUserNotes,
  updateNote,
  shareNote,
  searchNotes,
} from "../Controller/NoteController.js";

const router = express.Router();

// GET get a list of all notes for the authenticated user.

router.get("/", AUTHENTICATE_USER, getAllNotes);

// GET get a note by ID for the authenticated user.

router.get("/:userId", AUTHENTICATE_USER, getUserNotes);

// POST create a new note for the authenticated user.

router.post("/", AUTHENTICATE_USER, createNote);

// PUT update an existing note by ID for the authenticated user.

router.put("/:noteId", AUTHENTICATE_USER, updateNote);

// DELETE delete a note by ID for the authenticated user.

router.delete("/:noteId", AUTHENTICATE_USER, deleteNote);

// POST /api/notes/:id/share: share a note with another user for the authenticated user.

router.post("/:id/share", AUTHENTICATE_USER, shareNote);

// GET /api/search?query=searchQuery search for notes based on keywords for the authenticated user.

router.get("/search", AUTHENTICATE_USER, searchNotes);

export default router;
