// app/api/users/students/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongoose";
import UserModel from '@/models/users.model';

export async function GET() {
  await connectToDatabase();
  const users = await UserModel.find({ role: 'student' });
  return NextResponse.json(users);
}
