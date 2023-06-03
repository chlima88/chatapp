"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firebasedb } from "@/lib/db";
import {
  CollectionReference,
  DocumentData,
  Firestore,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { UserContext } from "@/context/UserContext";

interface User {
  uid: string;
  name: string;
  email: string;
  firstLogin: boolean;
}

export default function Page() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const { currentUser, setCurrentUser }: any = useContext(UserContext);

  if (!user) redirect("/login");

  const [foundUser, setFoundUser] = useState({} as User);

  getDoc(doc(firebasedb, "users", user?.uid as string)).then((result) => {
    setFoundUser({
      uid: result.id,
      name: result.data()?.name,
      email: result.data()?.email,
      firstLogin: result.data()?.firstLogin,
    });
  });

  useEffect(() => {
    setCurrentUser({
      name: user?.email?.split("@")[0],
      email: user?.email,
      uid: user?.uid,
    });
  }, [user]);

  async function handleUser(fn: Function) {
    await fn(doc(firebasedb, "users", user?.uid as string), {
      name: userName,
      email: currentUser?.email,
      firstLogin: false,
    });
  }

  async function handleSingUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userName === "") return;
    const action = (await foundUser) ? updateDoc : setDoc;
    const { email, uid } = currentUser;
    setCurrentUser({
      name: userName,
      email,
      uid,
    });
    handleUser(action);
    router.push("/chatapp");
  }

  return !foundUser.firstLogin ? (
    router.push("/chatapp")
  ) : (
    <div className="flex w-full items-center justify-center h-screen">
      <form
        className="flex flex-col gap-2 bg-violet-500 p-6"
        onSubmit={handleSingUp}
      >
        <div className="w-full text-center text-2xl text-gray-50 p-2">
          Welcome to <span className="font-semibold">ChatApp!</span>
        </div>
        <div className="relative mb-3" data-te-input-wrapper-init>
          <label
            className="block text-white font-bold mb-2"
            htmlFor="nameInput"
          >
            Name
          </label>
          <input
            id="nameInput"
            className="border-[1px] h-10 w-full rounded-md p-4"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name here"
          />
        </div>
        <button className="bg-white p-2 rounded-sm font-medium">Save</button>
      </form>
    </div>
  );
}
