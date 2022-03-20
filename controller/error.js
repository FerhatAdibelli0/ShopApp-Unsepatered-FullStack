exports.error = (req, res, next) => {
  res.status(404).render("404", { changedTitle: "Error", path: "/404" });
};
