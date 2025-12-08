"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const note_routes_1 = __importDefault(require("./note.routes"));
const folder_routes_1 = __importDefault(require("./folder.routes"));
const tag_routes_1 = __importDefault(require("./tag.routes"));
const link_routes_1 = __importDefault(require("./link.routes"));
const search_routes_1 = __importDefault(require("./search.routes"));
const router = (0, express_1.Router)();
// API routes
router.use("/notes", note_routes_1.default);
router.use("/folders", folder_routes_1.default);
router.use("/tags", tag_routes_1.default);
router.use("/links", link_routes_1.default);
router.use("/search", search_routes_1.default);
// Health check
router.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "RogueCultivator API is running",
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map