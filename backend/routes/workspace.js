import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  updateWorkspaceOwner,
  getWorkspaceActivity,
} from "../controllers/workspace.js";
import {
  inviteMemberSchema,
  updateWorkspaceSchema,
  tokenSchema,
  workspaceSchema,
} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.put(
  "/:workspaceId",
  authMiddleware,
  validateRequest({ body: updateWorkspaceSchema }),
  updateWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
router.get("/:workspaceId/members", authMiddleware, getWorkspaceMembers);
router.get("/:workspaceId/activity", authMiddleware, getWorkspaceActivity);

router.patch(
  "/:workspaceId/transfer",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  updateWorkspaceOwner
);

router.delete("/:workspaceId", authMiddleware, deleteWorkspace);

export default router;
