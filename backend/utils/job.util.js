const prisma = require("../lib/prisma");

const TYPE_TO_ENUM = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  remote: "REMOTE",
  contract: "CONTRACT",
};
const ENUM_TO_TYPE = Object.fromEntries(Object.entries(TYPE_TO_ENUM).map(([k, v]) => [v, k]));

const STATUS_TO_ENUM = { open: "OPEN", closed: "CLOSED" };
const ENUM_TO_STATUS = { OPEN: "open", CLOSED: "closed" };

function slugify(title) {
  return (
    String(title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 150) || "untitled"
  );
}

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugify(title);
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.job.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

function serializeJob(job) {
  if (!job) return job;
  const { id, type, status, ...rest } = job;
  return {
    _id: id,
    ...rest,
    type: ENUM_TO_TYPE[type] || type,
    status: ENUM_TO_STATUS[status] || status,
  };
}

module.exports = {
  TYPE_TO_ENUM,
  STATUS_TO_ENUM,
  slugify,
  generateUniqueSlug,
  serializeJob,
  serializeJobList: (jobs) => jobs.map(serializeJob),
};