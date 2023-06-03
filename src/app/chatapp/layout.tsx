"use client";
import { redirect, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useDocument,
  useDocumentData,
  useDocumentOnce,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query } from "firebase/firestore";

import { firebasedb as db, auth } from "@/lib/db";
import ConversationList from "@/components/ConversationList";
import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "@/context/UserContext";

interface CurrentUser {
  uid: string;
  name: string;
  email: string;
}
interface ICurrentUserContext {
  currentUser: CurrentUser;
  setCurrentUser: Dispatch<SetStateAction<CurrentUser>>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  if (!user) redirect("/login");

  const router = useRouter();
  const { currentUser, setCurrentUser } =
    useContext<ICurrentUserContext>(UserContext);

  const [snapshot] = useDocument(doc(db, "users", currentUser?.uid as string));

  function handleLogOut(): void {
    signOut(auth);
  }

  return loading ? (
    <div className="flex flex-col items-center absolute top-1/2 left-1/2 translate-x-1/2">
      Loading...
      <CircularProgress />
    </div>
  ) : (
    <div className="flex flex-row ">
      <div className="h-screen">
        <div className="w-96 h-screen">
          <div className="w-full h-screen flex flex-col gap-4 py-4 pl-4 pr-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div>
                  <Icon icon="radix-icons:avatar" width="50" height="50" />
                </div>
                <div className="font-bold">{snapshot?.data()?.name}</div>
              </div>
              <button
                className="flex items-center gap-1"
                onClick={handleLogOut}
              >
                Sair
                <Icon
                  icon="material-symbols:exit-to-app"
                  width="20"
                  height="20"
                />
              </button>
            </div>
            <button className="bg-violet-500 text-white p-2 rounded-md font-semibold">
              New Conversation
            </button>
            <ConversationList />
          </div>
        </div>
      </div>
      <div className="w-full h-screen">{children}</div>
    </div>
  );
}
