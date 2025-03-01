"use client"

import jwt from "jsonwebtoken";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useState} from "react";

export default function Dashboard() {
  const [studentsList, setStudentsList] = useState([]);
  const token = localStorage.getItem('mathtor-token');
  if (!token) {
    return null;
  }
  const data = jwt.decode(token);
  if (!data || typeof data === "string") {
    return null;
  }
  
  async function getStudentsList() {
    const response = await axios.get('/api/users/get-students', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('mathtor-token'),
      }
    });
    setStudentsList(response.data);
  }
  return (
    <div className="p-20">
      {data?.role === "admin" && (
        <AlertDialog>
          <AlertDialogTrigger className="px-4 py-3 bg-black text-white rounded-lg" onClick={getStudentsList}>
            View students
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Students</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex flex-col gap-y-5">
                  <div>
                    Students using the platform with scores for quizzes
                  </div>
                  {studentsList && JSON.stringify(studentsList, null, 2)}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
