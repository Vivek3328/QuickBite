/**
 * Simple ops auth: set ADMIN_API_KEY in backend .env and send header x-admin-key.
 */
function adminAuth(req, res, next) {
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    return res.status(503).json({ success: false, error: "Admin API not configured" });
  }
  const sent = req.header("x-admin-key");
  if (!sent || sent !== key) {
    return res.status(401).json({ success: false, error: "Invalid admin key" });
  }
  next();
}

module.exports = { adminAuth };
