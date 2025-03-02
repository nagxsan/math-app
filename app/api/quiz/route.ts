// app/api/quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongoose";
import QuizModel from '@/models/quiz.model';

export async function GET() {
  await connectToDatabase();
  const res = await QuizModel.find().select('quiz -_id');
  if (!res) {
    return NextResponse.json({ error: 'Could not find quizzes' }, {status: 500});
  }

  return NextResponse.json({ message: 'Successfully returned quizzes', quizzes: res }, { status: 200 });
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { quiz } = await req.json();
  const res = await QuizModel.create({ quiz });
  if (!res) {
    return NextResponse.json({ error: 'Could not insert quiz into db' }, {status: 500});
  }

  return NextResponse.json({ message: 'Successfully added quiz '}, { status: 200 });
}
