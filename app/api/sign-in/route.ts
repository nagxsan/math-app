import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongoose";
import UserModel from '@/models/users.model';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    
    await connectToDatabase();
    const { email, password } = await req.json();
    const user = await UserModel.findOne({
      email: email
    });
    
    if (!user) {
      return NextResponse.json({
        error: "User not found"
      }, {
        status: 400
      })
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({
        error: "Incorrect username or password"
      }, {
        status: 400
      })
    }
    
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET);
    
    return NextResponse.json({ message: 'User signed in successfully', token }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
