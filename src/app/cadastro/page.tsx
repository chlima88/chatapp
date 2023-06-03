"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, updateDoc, setDoc, doc } from "firebase/firestore";

import { auth, firebasedb } from "@/lib/db";
import { UserContext } from "@/context/UserContext";
import Loading from "@/components/Loading";

export default function Page() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [userName, setUserName] = useState("");
  const { currentUser, setCurrentUser } = useContext(UserContext);

  if (!user) redirect("/login");

  useEffect(() => {
    setUserName(user?.email?.split("@")[0] ?? "");

    (async function () {
      const userData = await getDoc(
        doc(firebasedb, "users", user?.uid as string)
      );

      setCurrentUser({
        uid: userData?.id ?? user?.uid,
        name: userData?.data()?.name ?? user?.email?.split("@")[0],
        email: userData?.data()?.email ?? user?.email,
        firstLogin: userData?.data()?.firstLogin ?? true,
      });
    })();
  }, [setCurrentUser, user]);

  async function handleSingUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userName === "") return;
    await setDoc(doc(firebasedb, "users", user?.uid as string), {
      name: userName,
      email: currentUser?.email,
      firstLogin: false,
    });

    setCurrentUser({
      ...currentUser,
      name: userName,
    });
    router.push("/chatapp");
  }

  return currentUser.firstLogin == undefined ? (
    <Loading />
  ) : currentUser.firstLogin ? (
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
  ) : (
    router.push("/chatapp")
  );
}
