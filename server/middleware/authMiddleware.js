import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = await req.headers.authorization;

         if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

     const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.role = decoded.role;

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Invalid or expired token"
        })
    }
};

export default authMiddleware;