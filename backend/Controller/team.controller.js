const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// PUBLIC — published members only, ordered
exports.getPublicTeam = asyncHandler(async (req, res) => {
  const team = await prisma.teamMember.findMany({
    where: { isPublished: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return res.status(200).json(new ApiResponse(200, team));
});

// ADMIN — list all
exports.listTeam = asyncHandler(async (req, res) => {
  const team = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return res.status(200).json(new ApiResponse(200, team));
});

// ADMIN — get one
exports.getTeamMember = asyncHandler(async (req, res) => {
  const member = await prisma.teamMember.findUnique({ where: { id: req.params.id } });
  if (!member) throw new ApiError(404, "Team member not found");
  return res.status(200).json(new ApiResponse(200, member));
});

// ADMIN — create
exports.createTeamMember = asyncHandler(async (req, res) => {
  const { name, role, photo, bio, message, isFeatured, order, isPublished, links } = req.body;

  if (!name || !role || !photo) {
    throw new ApiError(400, "name, role and photo are required");
  }

  const member = await prisma.teamMember.create({
    data: {
      name,
      role,
      photo,
      bio: bio || null,
      message: message || null,
      isFeatured: !!isFeatured,
      order: order !== undefined ? Number(order) : 0,
      isPublished: !!isPublished,
      links: links || null,
    },
  });

  return res.status(201).json(new ApiResponse(201, member, "Team member created"));
});

// ADMIN — update
exports.updateTeamMember = asyncHandler(async (req, res) => {
  const { name, role, photo, bio, message, isFeatured, order, isPublished, links } = req.body;

  try {
    const member = await prisma.teamMember.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(photo !== undefined && { photo }),
        ...(bio !== undefined && { bio }),
        ...(message !== undefined && { message }),
        ...(isFeatured !== undefined && { isFeatured: !!isFeatured }),
        ...(order !== undefined && { order: Number(order) }),
        ...(isPublished !== undefined && { isPublished: !!isPublished }),
        ...(links !== undefined && { links }),
      },
    });
    return res.status(200).json(new ApiResponse(200, member, "Team member updated"));
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Team member not found");
    throw err;
  }
});

// ADMIN — publish toggle
exports.publishTeamMember = asyncHandler(async (req, res) => {
  const { isPublished } = req.body;
  try {
    const member = await prisma.teamMember.update({
      where: { id: req.params.id },
      data: { isPublished: !!isPublished },
    });
    return res.status(200).json(new ApiResponse(200, member));
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Team member not found");
    throw err;
  }
});

// ADMIN — delete
exports.deleteTeamMember = asyncHandler(async (req, res) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    return res.status(200).json(new ApiResponse(200, null, "Team member deleted"));
  } catch (err) {
    if (err.code === "P2025") throw new ApiError(404, "Team member not found");
    throw err;
  }
});