import { Router, RequestHandler } from "express";
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

router.get("/me", getCurrentUser as RequestHandler);
router.patch("/me", updateProfile as RequestHandler);
router.get("/all", getAllUsers as RequestHandler);
router.get("/:id", getUserById as RequestHandler);
router.post("/follow/:id", followUser as RequestHandler);
router.post("/unfollow/:id", unfollowUser as RequestHandler);
router.post("/bookmark/add", addBookmark as RequestHandler);
router.post("/bookmark/remove", removeBookmark as RequestHandler);



export default router;