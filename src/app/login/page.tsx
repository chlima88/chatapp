"use client";

import { redirect, useRouter } from "next/navigation";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/lib/db";
import { Icon } from "@iconify/react";
import { useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";

export default function Page() {
  const [signInWithGoole, user, loading] = useSignInWithGoogle(auth);
  const router = useRouter();
  const { userSession, userLoading, currentUser, setCurrentUser } =
    useContext(GlobalContext);

  async function handleSignIn() {
    // await setPersistence(auth, browserLocalPersistence);
    await signInWithGoole([], { prompt: "select_account" });
  }

  if (userSession) {
    // <div>Login</div>
    router.push("/cadastro");
  }

  return (
    <div className="flex w-full items-center justify-center h-screen">
      <div className="flex flex-col gap-4 border-violet-500  p-4 rounded-md">
        <div className="w-full text-center text-2xl text-gray-600 p-4">
          Welcome to <span className="font-semibold text-3xl">ChatApp!</span>
        </div>
        <button
          className="flex items-center justify-center gap-4 bg-white text-violet-500  border-violet-500 hover:bg-violet-500 hover:text-white transition-colors  border-[1px] p-2 rounded-sm font-medium"
          onClick={handleSignIn}
        >
          <Icon icon="devicon:google" />
          <div className="text-center">Sign-In with Google</div>
        </button>
      </div>
    </div>
  );
}
