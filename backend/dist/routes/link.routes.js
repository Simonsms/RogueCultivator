"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkController = __importStar(require("../controllers/link.controller"));
const router = (0, express_1.Router)();
// GET /api/links - 获取链接列表
router.get('/', linkController.getLinks);
// GET /api/links/:id - 获取单个链接
router.get('/:id', linkController.getLink);
// POST /api/links - 创建链接
router.post('/', linkController.createLink);
// PUT /api/links/:id - 更新链接
router.put('/:id', linkController.updateLink);
// DELETE /api/links/:id - 删除链接
router.delete('/:id', linkController.deleteLink);
// POST /api/links/fetch-meta - 抓取链接元信息
router.post('/fetch-meta', linkController.fetchMeta);
exports.default = router;
//# sourceMappingURL=link.routes.js.map