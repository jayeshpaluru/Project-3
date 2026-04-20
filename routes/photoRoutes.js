/* eslint-disable import/extensions */
import express from 'express';

import {
  addCommentToPhoto,
  getPhotosOfUser,
} from '../controllers/photoController.js';
import requireLogin from '../middleware/requireLogin.js';

const router = express.Router();

router.get('/photosOfUser/:id', requireLogin, getPhotosOfUser);
router.post('/commentsOfPhoto/:id', requireLogin, addCommentToPhoto);

export default router;
