import { Router } from "express";
import {
  getPosts,
  patchPost,
  postComment,
  postPost,
  postReaction,
  removePost,
  removeComment,
} from "../controllers/posts.controller.js";
import { optionalAdmin, requireAdmin } from "../middlewares/auth.js";
import { uploadImage } from "../middlewares/upload.js";

const router = Router();

router.get("/", optionalAdmin, getPosts);
router.post("/", requireAdmin, uploadImage.single("imagen"), postPost);
router.patch("/:id", requireAdmin, uploadImage.single("imagen"), patchPost);
router.delete("/:id", requireAdmin, removePost);
router.post("/:id/comments", optionalAdmin, postComment);
router.delete("/:id/comments/:commentId", requireAdmin, removeComment);
router.post("/:id/reactions", optionalAdmin, postReaction);

export default router;
