"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";

import { auth, firebasedb } from "@/lib/db";
import { GlobalContext } from "@/context/GlobalContext";
import Loading from "@/components/Loading";

export default function Page() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const userNameInput = useRef<HTMLInputElement>(null);

  const userName = useRef("");
  const { currentUser, setCurrentUser } = useContext(GlobalContext);

  useEffect(() => {
    if (!user) redirect("/login");
    else {
      userName.current = user?.email?.split("@")[0] ?? "";
      const currentUserRef = doc(firebasedb, "users", user?.uid as string);

      (async function () {
        const userData = await getDoc(
          doc(firebasedb, "users", user?.uid as string)
        );

        setCurrentUser({
          uid: userData?.id ?? user?.uid,
          name: userData?.data()?.name ?? user?.email?.split("@")[0],
          email: userData?.data()?.email ?? user?.email,
          firstLogin: userData?.data()?.firstLogin ?? true,
          ref: currentUserRef,
        });
      })();
    }
  }, [setCurrentUser, user, userLoading]);

  useEffect(() => {
    if (userNameInput.current) userNameInput.current!.value = userName.current;
  }, [currentUser]);

  async function handleSingUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userName.current === "") return;
    await setDoc(doc(firebasedb, "users", user?.uid as string), {
      name: userName.current,
      email: currentUser?.email,
      firstLogin: false,
    });

    setCurrentUser({
      ...currentUser,
      name: userName.current,
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
            ref={userNameInput}
            onChange={(e) => (userName.current = e.target.value)}
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
