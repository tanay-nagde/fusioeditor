import express from 'express';
import {
  createCanvas,
  getCanvasById,
  saveCanvasData,
  getAllCanvasesForUser,
  shareCanvasWithUser,
  updateCanvasDetails,
  deleteCanvas,
  getUserCanvases
} from '../controller/canvas.controller.js';
import verifyJWT from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', verifyJWT, createCanvas);
router.get('/user', verifyJWT, getUserCanvases);
router.get('/:id', verifyJWT, getCanvasById);
router.post('/:id/save', verifyJWT, saveCanvasData);
router.get('/', verifyJWT, getAllCanvasesForUser);
router.post('/:id/share', verifyJWT, shareCanvasWithUser);
router.put('/:id', verifyJWT, updateCanvasDetails);
router.delete('/:id', verifyJWT, deleteCanvas);

export default router;
