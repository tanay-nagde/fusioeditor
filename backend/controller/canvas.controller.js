import Canvas from '../models/canvas.model.js';
import { v4 as uuidv4 } from 'uuid';

// Create Canvas
const createCanvas = async (req, res) => {
  try {
    const canvasSlug = uuidv4();
    const newCanvas = new Canvas({
      title: req.body.title || 'Untitled Canvas',
      owner: req.user._id,
      canvasSlug,
    });
    await newCanvas.save();
    res.status(201).json({ canvasId: newCanvas._id, canvasSlug });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create canvas', details: error.message });
  }
};

// Get Canvas by ID
const getCanvasById = async (req, res) => {
  try {
    const canvas = await Canvas.findById(req.params.id).populate('owner sharedTo');
    if (!canvas) return res.status(404).json({ error: 'Canvas not found' });

    // Optional: check ownership/access
    if (!canvas.owner.equals(req.user._id) && !canvas.sharedTo.includes(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json(canvas);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching canvas', details: error.message });
  }
};

// Get All Canvases Owned or Shared with User
const getAllCanvasesForUser = async (req, res) => {
  try {
    const canvases = await Canvas.find({
      $or: [
        { owner: req.user._id },
        { sharedTo: req.user._id },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching canvases', details: error.message });
  }
};

// Update Canvas Details
const updateCanvasDetails = async (req, res) => {
  try {
    const canvas = await Canvas.findById(req.params.id);
    if (!canvas) return res.status(404).json({ error: 'Canvas not found' });

    if (!canvas.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only the owner can update the canvas' });
    }

    if (req.body.title) canvas.title = req.body.title;

    await canvas.save();
    res.status(200).json(canvas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update canvas', details: error.message });
  }
};

// Delete Canvas
const deleteCanvas = async (req, res) => {
  try {
    // Find the canvas and delete it in one go,
    // while also getting the document to check ownership.
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    // Ensure req.user._id is a Mongoose ObjectId for proper comparison
    // If req.user._id is a string, you might need:
    // if (canvas.owner.toString() !== req.user._id.toString()) {
    if (!canvas.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only the owner can delete the canvas' });
    }

    // Use findByIdAndDelete for a more concise and up-to-date approach
    await Canvas.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Canvas deleted successfully' });
  } catch (error) {
    console.error('Error deleting canvas:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete canvas', details: error.message });
  }
};

// Share Canvas with another user
const shareCanvasWithUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const canvas = await Canvas.findById(req.params.id);
    if (!canvas) return res.status(404).json({ error: 'Canvas not found' });

    if (!canvas.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only the owner can share the canvas' });
    }

    if (!canvas.sharedTo.includes(userId)) {
      canvas.sharedTo.push(userId);
      await canvas.save();
    }

    res.status(200).json({ message: 'Canvas shared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share canvas', details: error.message });
  }
};
const getUserCanvases = async (req, res) => {
  try {
    const canvases = await Canvas.find({
      $or: [{ owner: req.user._id }, { sharedTo: req.user._id }],
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(canvases);
  } catch (error) {
    res.status(500).json({ error: "Error fetching canvases", details: error.message });
  }
};
const saveCanvasData = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const canvas = await Canvas.findById(id);
    if (!canvas) return res.status(404).json({ error: "Canvas not found" });

    // Authorization check
    if (
      !canvas.owner.equals(req.user._id) &&
      !canvas.sharedTo.includes(req.user._id)
    ) {
      return res.status(403).json({ error: "Not authorized to save canvas" });
    }

    canvas.data = data;
    await canvas.save();

    res.status(200).json({ message: "Canvas saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save canvas", details: error.message });
  }
};

export {
  createCanvas,
  getCanvasById,
  getAllCanvasesForUser,
  updateCanvasDetails,
  deleteCanvas,
  shareCanvasWithUser,
  saveCanvasData,
  getUserCanvases
};
