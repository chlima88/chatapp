"use client";
import { ChangeEvent, useContext, useState, KeyboardEvent } from "react";
import { Icon } from "@iconify/react";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/db";
import { GlobalContext } from "@/context/GlobalContext";
import ConversationList from "./ConversationList";
import StartConversation from "@/components/StartConversation";
import { redirect, useRouter } from "next/navigation";

export default function Sidebar() {
  const { currentUser } = useContext(GlobalContext);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function handleLogOut(): Promise<void> {
    await signOut(auth);
    // redirect("/login");
  }

  function handleNewConversation(): void {
    setShowModal(!showModal);
  }

  function handleSearchConversation(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setSearchInput(event.target.value);
  }

  function handleClearInput(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      setSearchInput("");
    }
  }

  function handleCancelSearch(): void {
    setSearchInput("");
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
          <div className="flex w-full py-2">
            <div className="relative flex w-full items-center group">
              <Icon
                className="text-slate-400 absolute left-3"
                icon="material-symbols:search"
                width="20"
                height="20"
              />
              <input
                className="py-2 px-10 border-[1px] w-full rounded-s-md"
                placeholder="Search conversation..."
                onChange={handleSearchConversation}
                onKeyDown={handleClearInput}
                value={searchInput}
              />
              <button
                className="absolute right-3 invisible text-slate-400 hover:text-violet-600 group-focus-within:visible"
                onClick={handleCancelSearch}
              >
                <Icon icon="iconamoon:close-light" width="24" height="24" />
              </button>
            </div>
            <button
              className="flex items-center justify-end w-10 hover:w-40 transition-all gap-2 bg-violet-500 group text-sm text-white p-2 rounded-e-md font-semibold"
              onClick={handleNewConversation}
            >
              <div className="shrink-0">New Chat</div>
              <div>
                <Icon icon="ci:chat-circle-add" width="24" height="24" />
              </div>
            </button>
          </div>
          <ConversationList filter={searchInput} />
        </div>
      </div>
    </div>
  );
}
