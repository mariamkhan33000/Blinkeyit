import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

        // If no token is found, return an error
        if (!token) {
            return res.status(401).json({ message: "Authentication token is required", error: true, success: false });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

        // Attach the user ID to the request object
        req.userId = decoded.id;
        
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", error: true, success: false });
    }
};

export default auth;
