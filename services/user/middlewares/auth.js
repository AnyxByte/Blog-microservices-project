import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "login again",
      });
    }

    const token = authHeaders.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verify) {
      return res.status(401).json({
        msg: "Invalid Token",
      });
    }

    req.user = verify;
    next();
  } catch (error) {
    console.log("error in auth middleware:- ", error);

    return res.status(500).json({
      msg: "server error",
    });
  }
};
