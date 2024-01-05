// note create read update delete

import Note from "../Model/NoteModel.js";
import User from "../Model/UserModel.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import ValidationCheck from "../Utils/ValidationCheck.js";

const createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!title || !content) {
      return res.json(new ValidationCheck(400, "Title and Content Required."));
    }
    if (title.trim() === "") {
      return res.json(new ValidationCheck(400, "Note must contain a title."));
    }
    if (content.trim() === "") {
      return res.json(new ValidationCheck(400, "Note must contain contents."));
    }
    const newNote = new Note({ title, content, userName: req.user._id });

    await newNote.save();
    req.user.notes.push(newNote._id);
    await req.user.save();

    return res.status(200).json(new ApiResponse(200, { newNote }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error.message }));
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("userName", "userName");
    return res.status(200).json(new ApiResponse(200, { notes }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error.message }));
  }
};

const getUserNotes = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    const userNotes = await Promise.all(
      user.notes.map(async (id) => {
        const singleNote = await Note.findById(id).populate(
          "userName",
          "userName"
        );
        return singleNote;
      })
    );

    const sharedNotes = await Note.find({ sharedWith: userId }).populate(
      "userName",
      "userName"
    );
    const modifiedSharedNotes = sharedNotes.map((note) => ({
      ...note.toObject(),
      isSHARED: true,
    }));

    const allNotes = [...userNotes, ...modifiedSharedNotes];
    return res.status(200).json(new ApiResponse(200, { data: { allNotes } }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error.message }));
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(noteId, { title, content });
    return res
      .status(200)
      .json(new ApiResponse(200, { message: "Note is updated successfully." }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error.message }));
  }
};
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    await Note.deleteOne({ _id: noteId });
    return res
      .status(200)
      .json(new ApiResponse(200, { message: "Note is deleted successfully." }));
  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error.message }));
  }
};
const shareNote = async (req, res) => {
  try {
    const { sharedWithUserId } = req.body;
    const noteId = req.params.noteId;
    const currentUser = req.user;

    if (!currentUser.notes.includes(noteId)) {
      return res
        .status(403)
        .json(
          new ApiResponse(403, "You don't have permission to share this note.")
        );
    }

    if (sharedWithUserId.trim() === "") {
      return res
        .status(400)
        .json(new ApiResponse(400, "UserId must be valid."));
    }

    const isValidSharedUser = await User.findById(sharedWithUserId);
    if (!isValidSharedUser) {
      return res.status(400).json(new ApiResponse(400, "User does not exist."));
    }

    const noteToShare = await NoteModel.findById(noteId);

    if (!noteToShare) {
      return res.status(404).json(new ApiResponse(404, "Note not found."));
    }

    if (noteToShare.sharedWith.includes(sharedWithUserId)) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Note already shared with this user."));
    }

    noteToShare.sharedWith.push(sharedWithUserId);
    await noteToShare.save();

    return res.json(new ApiResponse(200, "Note shared successfully."));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error."));
  }
};
const searchNotes = async (req, res) => {
  const { query } = req.query;
  try {
    const matchingNotes = await Note.find({
      $or: [
        { title: { $regex: query, $options: "i" } }, 
        { content: { $regex: query, $options: "i" } }, 
      ],
    }).populate("userName", "userName");

    return res.status(200).json(new ApiResponse(200, matchingNotes));
  } catch (error) {
    return res.status(500).json(new ApiError(500, { message: error.message }));
  }
};
export {
  createNote,
  getAllNotes,
  getUserNotes,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes
};
