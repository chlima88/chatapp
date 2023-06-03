"use client";

import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/db";

interface User {
  uid: string;
  name: string;
  email: string;
}

export default function Page() {
  const [signInWithGoole, user, loading] = useSignInWithGoogle(auth);

  async function handleSignIn() {
    await signInWithGoole();
  }

  return user ? (
    redirect("/cadastro")
  ) : (
    <div className="flex w-full items-center justify-center h-screen">
      <div className="flex flex-col bg-violet-500 p-2">
        <div className="w-full text-center text-2xl text-gray-50 p-2">
          Welcome to <span className="font-semibold">ChatApp!</span>
        </div>
        <button
          className="bg-white p-2 rounded-sm font-medium"
          onClick={handleSignIn}
        >
          Sign-In with Google
        </button>
      </div>
    </div>
  );
}
