import { Router } from "express";
import noteRoutes from "./note.routes";
import folderRoutes from "./folder.routes";
import tagRoutes from "./tag.routes";
import linkRoutes from "./link.routes";
import searchRoutes from "./search.routes";

const router = Router();

// API routes
router.use("/notes", noteRoutes);
router.use("/folders", folderRoutes);
router.use("/tags", tagRoutes);
router.use("/links", linkRoutes);
router.use("/search", searchRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "RogueCultivator API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
