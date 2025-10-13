export const protect = async (req, res, next) => {
  try {
    const { userID } = await req.auth();
    if (!userID) {
      return res.json({
        success: false,
        message: "Not Authenticated",
      });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
