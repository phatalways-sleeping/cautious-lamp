const mustExcludeFields = ["id", "isDeleted", "createdAt"];

module.exports = (model) => {
  switch (model) {
    case "User":
      return [...mustExcludeFields, "createdAt"];
    case "Project":
      return [...mustExcludeFields, "creator", "tasks",];
    case "Task":
      return [...mustExcludeFields, "slug"];
    case "Theme":
      return [...mustExcludeFields, "project", "creator"];
    default:
      return [...mustExcludeFields];
  }
};
