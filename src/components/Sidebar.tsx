"use client";
import { Icon } from "@iconify/react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/db";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import ConversationList from "./ConversationList";

export default function Sidebar() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

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
              <div className="font-bold">{currentUser.name}</div>
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
