"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import {useMemo, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password: string) => password.length >= 6;
  
  const isFormValid = useMemo(() => {
    return isValidEmail(email) && isValidPassword(password);
  }, [email, password]);
  
  async function handleSignInFormSubmit() {
    try {
      const response = await axios.post('/api/sign-up', {
        email,
        password,
        role: 'admin',
      });
      if (!response) {
        throw new Error('Error signing in the user');
      }
      const token = response.data.token;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Error signing in the user, please try again.", {
        description: "Incorrect email or password",
        style: {
          backgroundColor: "red",
        }
      })
    }
  }
  
  return (
    <div className="h-screen">
      <Card className="mx-auto" style={{ width: "450px", position: "relative", top: "50%", transform: "translateY(-50%)" }}>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in using your email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={!isFormValid} onClick={handleSignInFormSubmit}>Sign In</Button>
        </CardFooter>
      </Card>
    </div>
  )
}