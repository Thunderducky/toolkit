const ensureLogin = (req, res, next) => {
  if(req.user){
    next();
  }
  return res.send(401);
};

module.exports = { ensureLogin };
