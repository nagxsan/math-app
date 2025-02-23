// app/api/users/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongoose";
import UserModel from '@/models/users.model';

export async function GET() {
  await connectToDatabase();
  const users = await UserModel.find({});
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const data = await req.json();
  const newUser = new UserModel(data);
  await newUser.save();
  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}
