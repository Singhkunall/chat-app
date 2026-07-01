import express from 'express';
import { protectRoute } from '../middleware/auth.js';
import { addContact, getContacts, deleteContact } from '../controllers/trustedContactController.js';

const trustedContactRouter = express.Router();

trustedContactRouter.post("/", protectRoute, addContact);
trustedContactRouter.get("/", protectRoute, getContacts);
trustedContactRouter.delete("/:id", protectRoute, deleteContact);

export default trustedContactRouter;