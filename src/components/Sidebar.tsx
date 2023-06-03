"use client";
import { Icon } from "@iconify/react";
import { signOut } from "firebase/auth";
import { firebasedb, auth } from "@/lib/db";
import { UserContext } from "@/context/UserContext";
import { Dispatch, SetStateAction, useContext } from "react";
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import ConversationList from "./ConversationList";

interface CurrentUser {
  uid: string;
  name: string;
  email: string;
  firstLogin: boolean;
}
interface ICurrentUserContext {
  currentUser: CurrentUser;
  setCurrentUser: Dispatch<SetStateAction<CurrentUser>>;
}
export default function Sidebar() {
  const { currentUser, setCurrentUser } =
    useContext<ICurrentUserContext>(UserContext);

  const [snapshot] = useDocument(
    doc(firebasedb, "users", currentUser?.uid as string)
  );

  function handleLogOut(): void {
    signOut(auth);
  }

  return (
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
            <button className="flex items-center gap-1" onClick={handleLogOut}>
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
  );
}
