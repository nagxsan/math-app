import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string) {
  try {
    const res = jwt.verify(token, JWT_SECRET);
    return res;
  } catch (error) {
    return null
  }
}
