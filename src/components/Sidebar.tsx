"use client";
import { useContext, useState } from "react";
import { Icon } from "@iconify/react";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/db";
import { GlobalContext } from "@/context/GlobalContext";
import ConversationList from "./ConversationList";
import StartConversation from "@/components/StartConversation";

export default function Sidebar() {
  const { currentUser, setCurrentUser } = useContext(GlobalContext);
  const [showModal, setShowModal] = useState(false);

  function handleLogOut(): void {
    signOut(auth);
  }

  function handleNewConversation(): void {
    setShowModal(!showModal);
  }

  return (
    <div className="h-screen">
      <StartConversation display={showModal} toggle={setShowModal} />
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
          <button
            className="bg-violet-500 text-white p-2 rounded-md font-semibold"
            onClick={handleNewConversation}
          >
            New Conversation
          </button>
          <ConversationList />
        </div>
      </div>
    </div>
  );
}
