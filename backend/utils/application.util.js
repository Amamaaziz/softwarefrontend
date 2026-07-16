const STATUS_TO_ENUM = {
  new: "NEW",
  shortlisted: "SHORTLISTED",
  interview: "INTERVIEW",
  rejected: "REJECTED",
  hired: "HIRED",
};
const ENUM_TO_STATUS = Object.fromEntries(Object.entries(STATUS_TO_ENUM).map(([k, v]) => [v, k]));

// admin Applications.jsx compares selected.remote to `true`/`false` — 'yes'/'no'
// map cleanly, anything else (e.g. 'hybrid') passes through as a plain string.
function remoteJobToRemote(remoteJob) {
  if (remoteJob === "yes") return true;
  if (remoteJob === "no") return false;
  return remoteJob ?? null;
}
function remoteToRemoteJob(remote) {
  if (remote === true) return "yes";
  if (remote === false) return "no";
  return remote ?? null;
}

// Schema has one combined `applicantName` field; admin Applications.jsx's
// edit/view UI expects separate firstName/lastName. Split on first space —
// best-effort, since the data was never actually collected as two fields.
function splitName(applicantName) {
  if (!applicantName) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = applicantName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}
function joinName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function serializeApplication(app) {
  if (!app) return app;
  const { id, jobId, job, dob, remoteJob, status, applicantName, ...rest } = app;
  const { firstName, lastName } = splitName(applicantName);

  return {
    _id: id,
    ...rest,
    applicantName,
    firstName,
    lastName,
    dateOfBirth: dob,
    remote: remoteJobToRemote(remoteJob),
    status: ENUM_TO_STATUS[status] || status,
    job: job ? { _id: job.id, title: job.title } : null,
  };
}

module.exports = {
  STATUS_TO_ENUM,
  ENUM_TO_STATUS,
  remoteJobToRemote,
  remoteToRemoteJob,
  splitName,
  joinName,
  serializeApplication,
  serializeApplicationList: (apps) => apps.map(serializeApplication),
};