"use client";
import { FormEvent, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useCollectionData,
  useCollection,
  useDocument,
} from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { firebasedb } from "@/lib/db";

interface IParams {
  id: string;
}

interface IConversation {
  id: string;
  participants: string[];
  created_at: string;
  users: any[];
}

export default function Page({ params }: { params: IParams }) {
  const [inputText, setInputText] = useState("");

  const { id } = params;

  const q = query(
    collection(firebasedb, `conversations/${id}/messages`),
    orderBy("timestamp")
  );
  const [messages] = useCollectionData(q);

  const [snapshot, loading, error] = useCollection(
    collection(firebasedb, "conversations")
  );
  const conversation = snapshot?.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as IConversation))
    .find((conversation) => conversation.id === id);

  const [userSnapshot] = useDocument(conversation?.users[0]);

  const contactName = userSnapshot?.get("name");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputText === "") return;
    await addDoc(collection(firebasedb, `conversations/${id}/messages`), {
      text: inputText,
      sender: "clima@google.com",
      timestamp: serverTimestamp(),
    });
    setInputText("");
  }

  function getRelativeTime(timestamp: number) {
    const MINUTE_MILLISECONDS = 1000 * 60;
    const HOUR_MILLISECONDS = MINUTE_MILLISECONDS * 60;
    const DAY_MILLISECONDS = HOUR_MILLISECONDS * 24;
    const rtf = new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    });

    function getTimeDiff(timestamp: number, multplier: number) {
      return Math.round((new Date().getTime() - timestamp) / multplier) * -1;
    }

    let unit;
    let difference = getTimeDiff(timestamp, DAY_MILLISECONDS);

    if (difference > 7) {
      return new Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(timestamp);
    } else {
      unit = "day";
    }

    if (difference === 0) {
      difference = getTimeDiff(timestamp, HOUR_MILLISECONDS);
      unit = "hour";
    }

    if (difference === 0) {
      difference = getTimeDiff(timestamp, MINUTE_MILLISECONDS);
      unit = "minute";
    }

    return rtf.format(difference, unit);
  }

  return (
    <div className="flex flex-col px-2 py-4 gap-2 h-full">
      <div className="flex gap-5 items-center border-b-[1px] pb-2 h-20">
        <div className="text-slate-100 bg-slate-500 rounded-full">
          <Icon icon="radix-icons:avatar" width="45" height="45" />
        </div>
        <div>{contactName}</div>
      </div>
      <div className="h-full overflow-y-auto ">
        <div className="flex flex-col gap-2 pr-4">
          {messages?.map((message) => (
            <div
              className={
                "w-full " +
                `${message.sender === "clima@google.com" ? "pl-8" : "pr-8"}`
              }
              key={message.id}
            >
              <div
                className={
                  "p-2 rounded-md w-fit max-w-2xl " +
                  `${
                    message.sender === "clima@google.com"
                      ? "ml-auto bg-blue-300 "
                      : "mr-auto bg-green-300 "
                  }`
                }
              >
                <div>{message.text}</div>
                <div className={"text-xs text-slate-500 text-right"}>
                  {message.timestamp &&
                    getRelativeTime(message.timestamp.toDate())}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        className="flex border-t-[1px] gap-2 py-2 bottom-0 h-20"
        onSubmit={handleSubmit}
      >
        <textarea
          rows={2}
          max-rows="6"
          placeholder="Message"
          className="resize-none border-[1px]  border-slate-200 rounded-md p-2 text-black w-full"
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
        ></textarea>
        <button
          className="bg-sky-500 text-white font-semibold w-48 rounded-md hover:bg-sky-500/80"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
