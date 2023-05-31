"use client";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import { auth } from "@/lib/db";

export default function Page() {
  const [signInWithGoole, user, loading] = useSignInWithGoogle(auth);

  function handleSignIn() {
    signInWithGoole();
  }

  return !user ? (
    <div className="relative h-screen">
      <div className="flex flex-col absolute top-1/2 left-1/2 -translate-x-1/2 bg-violet-500 p-2">
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
  ) : (
    redirect("/chatapp")
  );
}
