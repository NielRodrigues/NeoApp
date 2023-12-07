import { promisify } from "util";
import jwt from "jsonwebtoken";

export default async (request, response, next) => {
  const { originalUrl } = request;
  const authHeader = request.headers.authorization;

  const verifyAsync = promisify(jwt.verify);

  if (originalUrl.startsWith("/login") || originalUrl.startsWith("/register")){
    return next();
  }

  if (authHeader) {
    try{
      const decoded = await verifyAsync(authHeader, "y8rbmhfeyvgkywpc1uqrwh4p57hxmls4")
      if (decoded) {
        return next();
      }
    } catch {
      try{
        const decoded = await verifyAsync(authHeader, "fe67hzp5epvrde492d7jd4gv35kwv2sb")
        if (decoded) {
          return next();
        }
      } catch {
        return response.status(401).json({ error: "User not allowed to access this API." });
      }
    }
  }

  return response.status(401).json({ error: "User not allowed to access this API." });
};