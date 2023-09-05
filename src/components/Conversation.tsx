"use client";
import { GlobalContext } from "@/context/GlobalContext";
import { firebasedb } from "@/lib/db";
import { Icon } from "@iconify/react";
import { DocumentData, collection, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useContext } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

interface IProps {
  displayName: string;
  uid: string;
}

export default function Conversation({ displayName, uid }: IProps) {
  const { currentUser } = useContext(GlobalContext);
  const [messages] = useCollectionData(
    query(
      collection(firebasedb, `conversations/${uid}/messages`),
      orderBy("timestamp")
    )
  );

  function countNewMessages(messages: DocumentData[]) {
    const length = messages?.filter(
      (message) =>
        message.sender.id != currentUser.uid && message.unread == true
    ).length;

    if (length > 0 && length <= 99) {
      return (
        <div className="flex justify-center text-xs w-8 py-1 text-white font-semibold bg-red-500 rounded-full">
          {length}
        </div>
      );
    } else if (length > 99) {
      return (
        <div className="flex justify-center text-xs w-8 py-1 text-white font-semibold bg-red-500 rounded-full">
          99+
        </div>
      );
    }
  }

  return (
    <Link href={`chatapp/conversations/${uid}`}>
      <div className="flex  flex-row items-center justify-between p-2 hover:bg-sky-100 hover:cursor-pointer">
        <div className="flex flex-row gap-2 overflow-hidden">
          <div className="text-slate-100 bg-slate-500 rounded-full">
            <Icon icon="radix-icons:avatar" width="40" height="40" />
          </div>
          <div className="flex flex-col overflow-hidden ">
            <div className="text-sm font-semibold">{displayName}</div>
            <div className="text-xs text-slate-500 truncate ">
              {messages?.slice(-1)[0]?.sender.id == currentUser.uid &&
              messages
                ?.slice(-1)[0]
                .lastSeenBy.filter(
                  (user: DocumentData) => user.id != currentUser.uid
                ) &&
              messages?.slice(-1)[0]?.lastSeenBy?.length > 0 ? (
                <Icon className={"inline mr-1"} icon="fluent:eye-24-filled" />
              ) : (
                ""
              )}
              {messages?.slice(-1)[0]?.text || ""}
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col items-center">
          <div className="text-xs">
            {new Intl.DateTimeFormat(["pt-BR"], {
              hour: "numeric",
              minute: "numeric",
            }).format(messages?.slice(-1)[0]?.timestamp)}
          </div>
          {countNewMessages(messages!)}
        </div>
      </div>
    </Link>
  );
}
