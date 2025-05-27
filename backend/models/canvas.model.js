// models/Canvas.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CanvasSchema = new Schema({
  title: { type: String, default: 'Untitled Canvas' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  data : { type: Object, default: {} }, // Store canvas data as an object
  sharedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  canvasSlug: { type: String, required: true }, 
});

const Canvas = model('Canvas', CanvasSchema);

export default Canvas;
