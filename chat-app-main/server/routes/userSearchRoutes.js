import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { searchUsers, getUserByUsername } from '../controllers/userSearchController.js';

const userSearchRouter = express.Router();

userSearchRouter.get("/search", protectRoute, searchUsers);
userSearchRouter.get("/by-username/:username", protectRoute, getUserByUsername);

export default userSearchRouter;