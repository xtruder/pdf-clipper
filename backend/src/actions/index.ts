import { Router } from "express";

import { createFileHandler } from "./createFile";
import { getFileUrlHandler } from "./createFileDownloadUrl";
import { createDocumentImagePostPolicy } from "./createDocumentImagePostPolicy";

export const router = Router();

router.post("/createFile", createFileHandler);
router.post("/createFileDownloadUrl", getFileUrlHandler);
router.post("/createDocumentImagePostPolicy", createDocumentImagePostPolicy);
