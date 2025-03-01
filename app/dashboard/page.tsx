"use client"

import jwt from "jsonwebtoken";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {Button} from "@/components/ui/button";
import axios from "axios";
import {useEffect, useMemo, useState} from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"

export default function Dashboard() {
  const [studentsList, setStudentsList] = useState<{ email: string }[]>([]);
  const [question, setQuestion] = useState<string>('');
  const [option1, setOption1] = useState<string>('');
  const [option2, setOption2] = useState<string>('');
  const [option3, setOption3] = useState<string>('');
  const [option4, setOption4] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<string>('');

  const [quiz, setQuiz] = useState<any[]>([]);

  const [quizzes, setQuizzes] = useState<any[]>([]);

  const [selectedQuiz, setSelectedQuiz] = useState<number>();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleOptionChange = (questionId: string, selectedValue: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: selectedValue,
    }));
  };

  const token = localStorage.getItem('mathtor-token');
  if (!token) {
    return null;
  }
  const data = jwt.decode(token);
  if (!data || typeof data === "string") {
    return null;
  }

  useEffect(() => {
    async function fetchQuizzes() {
      const quizzes = await axios.get('/api/quiz', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('mathtor-token'),
        }
      })
  
      setQuizzes(quizzes.data.quizzes);
    }
    fetchQuizzes();
  }, [])
  
  async function getStudentsList() {
    const response = await axios.get('/api/users/get-students', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('mathtor-token'),
      }
    });
    setStudentsList(response.data);
  }

  function addQuizQuestion() {
    setQuiz((prev) => {
      return [
        ...prev,
        {
          question: question,
          options: [
            {
              number: 1,
              value: option1
            },
            {
              number: 2,
              value: option2
            },
            {
              number: 3,
              value: option3
            },
            {
              number: 4,
              value: option4
            }
          ],
          correctOption: Number(correctOption)
        }
      ]
    })
    setQuestion('')
    setOption1('')
    setOption2('')
    setOption3('')
    setOption4('')
    setCorrectOption('')
  }

  async function addQuiz() {
    try {
      const response = await axios.post('/api/quiz', {
        quiz
      }, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('mathtor-token'),
        }
      });

      const quizzes = await axios.get('/api/quiz', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('mathtor-token'),
        }
      })

      setQuizzes(quizzes.data.quizzes);

    } catch (e: any) {
      console.log(e?.response?.data || e?.message);
    } finally {
      setQuiz([]);
    }
  }

  function handleQuizSubmit() {
    if (!selectedQuiz) return;
    console.log({quizzes});
    const quiz = quizzes[selectedQuiz].quiz;
    console.log({quiz});
    let score = 0;
    for (const key of Object.keys(quizAnswers)) {
      const questionIdx = Number(key.split('.')[0])
      console.log({questionIdx})
      console.log({question: quiz[questionIdx]});
      console.log(Number(quizAnswers[key]) === Number(quiz[questionIdx]?.correctOption))
      score += (Number(quizAnswers[key]) === Number(quiz[questionIdx]?.correctOption) ? 1 : 0)
    }

    setQuizScore(score)
  }
  return (
    data?.role === "admin" ? (
      <div className="flex flex-col gap-10">
        <div className="p-10 flex flex-wrap gap-10">
          <Dialog>
            <DialogTrigger className="px-4 py-3 bg-black text-white rounded-lg" onClick={getStudentsList}>
              View students
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Students</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-y-5">
                    <div>
                      Students using the platform with scores for quizzes
                    </div>
                    {studentsList && studentsList.map((st, idx) => (
                      <div key={idx}>
                        {st?.email}
                      </div>
                    ))}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="px-4 py-3 bg-black text-white rounded-lg">
              Add quiz
            </DialogTrigger>
            <DialogContent className="max-h-[650px] overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Quiz</DialogTitle>
                <DialogDescription>
                  {quiz && quiz.map((question, idx) => (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {`Question ${idx + 1}`}
                        </CardTitle>
                        <CardDescription>
                          {question.question}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-y-5">
                          <div>Options:</div>
                          {question.options.map((option: any, idx: any) => (
                            <div key={idx}>
                              {option.number}: {option.value}
                            </div>
                          ))}
                          <div>Correct option: {question.correctOption}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card>
                    <CardHeader>
                      <CardTitle>Question 1</CardTitle>
                      <CardDescription>
                        <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input placeholder="Enter option 1" value={option1} onChange={(e) => setOption1(e.target.value)} required />
                      <Input placeholder="Enter option 2" value={option2} onChange={(e) => setOption2(e.target.value)} required />
                      <Input placeholder="Enter option 3" value={option3} onChange={(e) => setOption3(e.target.value)} required />
                      <Input placeholder="Enter option 4" value={option4} onChange={(e) => setOption4(e.target.value)} required />
                      <Input placeholder="Enter correct option number (1,2,3,4)" value={correctOption} onChange={(e) => setCorrectOption(e.target.value)} required />
                    </CardContent>
                    <CardFooter>
                      <Button variant="secondary" onClick={addQuizQuestion}>Add question</Button>
                      <Button variant="default" onClick={addQuiz}>Add Quiz</Button>
                    </CardFooter>
                  </Card>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
        <div className="flex flex-col gap-10 p-10">
          <div>Quizzes</div>
          <div className="flex flex-wrap gap-10">
            {quizzes && quizzes.map((quiz, idx) => (
              <Dialog key={idx}>
                <DialogTrigger className="px-4 py-3 bg-black text-white rounded-lg">
                  Quiz {idx + 1}
                </DialogTrigger>
                <DialogContent className="max-h-[650px] overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Quiz</DialogTitle>
                    <DialogDescription>
                      {quiz && quiz.quiz && quiz.quiz.map((question: any, idx: any) => (
                        <Card>
                          <CardHeader>
                            <CardTitle>
                              {`Question ${idx + 1}`}
                            </CardTitle>
                            <CardDescription>
                              {question.question}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col gap-y-5">
                              <div>Options:</div>
                              {question.options.map((option: any, idx: any) => (
                                <div key={idx}>
                                  {option.number}: {option.value}
                                </div>
                              ))}
                              <div>Correct option: {question.correctOption}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-10 p-10">
        <div>Quizzes</div>
        <div className="flex flex-wrap gap-10">
          {quizzes && quizzes.map((quiz, idx) => (
            <Dialog key={idx}>
              <DialogTrigger className="px-4 py-3 bg-black text-white rounded-lg" onClick={() => setSelectedQuiz(idx)}>
                Quiz {idx + 1}
              </DialogTrigger>
              <DialogContent className="max-h-[650px] overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle>Quiz</DialogTitle>
                  <DialogDescription>
                    {quiz && quiz.quiz && quiz.quiz.map((question: any, idx: any) => (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {`Question ${idx + 1}`}
                          </CardTitle>
                          <CardDescription>
                            {question.question}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-y-5">
                            <div>Options:</div>
                            <RadioGroup value={quizAnswers[`${idx}.question.${question.question}`] || ""} onValueChange={(value) => handleOptionChange(`${idx}.question.${question.question}`, value)}>
                              {question.options.map((option: any, idx: any) => (
                                <div key={option.number} className="flex items-center space-x-2">
                                  <RadioGroupItem value={option.number.toString()} id={`question-${idx + 1}-option-${option.number}`} />
                                  <Label htmlFor={`question-${idx + 1}-option-${option.number}`}>{option.value}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {quizScore !== null && (
                      <div>
                        You scored {quizScore} / {quiz.quiz.length}
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="default" onClick={handleQuizSubmit}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    )
  );
}
