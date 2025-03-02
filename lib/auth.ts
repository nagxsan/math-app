import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyToken(token: string) {
  try {
    const res = jwt.decode(token);
    return res;
  } catch (error) {
    return null
  }
}
