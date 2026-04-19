/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Used when you implement the TODO handlers below.
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line import/extensions
import User from './schema/user.js';
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line import/extensions
import Photo from './schema/photo.js';

const app = express();

// define these in env and import in this file
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/project2';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000/index.html';

// Enable CORS for frontend running on a different port
app.use(cors());

app.get('/', (req, res) => {
  res.redirect(frontendUrl);
});

// Connect to MongoDB
mongoose.connect(mongoUrl);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function mapUserListItem(user) {
  return {
    _id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

function mapUserDetail(user) {
  return {
    _id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    location: user.location,
    description: user.description,
    occupation: user.occupation,
  };
}

/**
 * GET /user/list
 * Returns the list of users.
 */
app.get('/user/list', async (req, res) => {
  try {
    const users = await User.find({}, {
      first_name: 1,
      last_name: 1,
    }).lean();

    return res.json(users.map(mapUserListItem));
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /user/:id
 * Returns the details of one user.
 */
app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    const user = await User.findById(userId, {
      first_name: 1,
      last_name: 1,
      location: 1,
      description: 1,
      occupation: 1,
    }).lean();

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.json(mapUserDetail(user));
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /photosOfUser/:id
 * Returns all photos of the given user.
 */
app.get('/photosOfUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send('Invalid user id');
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).send('User not found');
    }

    const [photos, users] = await Promise.all([
      Photo.find({ user_id: userId }, {
        user_id: 1,
        file_name: 1,
        date_time: 1,
        comments: 1,
      }).lean(),
      User.find({}, {
        first_name: 1,
        last_name: 1,
      }).lean(),
    ]);

    const userLookup = new Map(
      users.map((user) => [user._id.toString(), mapUserListItem(user)]),
    );

    const response = photos.map((photo) => ({
      _id: photo._id.toString(),
      user_id: photo.user_id.toString(),
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: (photo.comments || []).map((comment) => ({
        _id: comment._id.toString(),
        comment: comment.comment,
        date_time: comment.date_time,
        user: userLookup.get(comment.user_id.toString()) || null,
      })),
    }));

    return res.json(response);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
