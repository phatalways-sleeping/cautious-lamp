// Function returns another function but catch the error thrown by func
module.exports = (func) => (req, res, next) => {
  func(req, res, next).catch((err) => next(err));
};
