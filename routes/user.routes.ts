// server/routes/user.routes.ts
import { Router } from "express";
import {
  getUserById,
  followUser,
  unfollowUser,
  updateProfile,
  addBookmark,
  removeBookmark,
  getCurrentUser,
  getAllUsers,


} from "../controllers/user.controller";

const router = Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unfollowUser);
router.post("/bookmark/add", addBookmark);
router.post("/bookmark/remove", removeBookmark);



export default router;
