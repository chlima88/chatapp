"use client";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import {
  collection,
  updateDoc,
  query,
  where,
  orderBy,
  doc,
} from "firebase/firestore";
import { firebasedb } from "@/lib/db";
import { GlobalContext } from "@/context/GlobalContext";
import Link from "next/link";
import { messageService } from "@/services/messageService";
import MessageBaloon from "@/components/MessageBaloon";
import { IConversationData, IMessage, IMessageStyle } from "@/lib/types";

type IParams = {
  uid: string;
};

function useMessages(uid: string): IMessage[] {
  const { currentUser } = useContext(GlobalContext);

  const [messagesData] = useCollection(
    query(
      collection(firebasedb, `conversations/${uid}/messages`),
      orderBy("timestamp")
    )
  );

  const messages = messagesData?.docs.map(
    (message) =>
      ({
        id: message.id,
        ...message.data(),
      } as IMessage)
  );

  useEffect(() => {
    messages
      ?.filter(
        (message) =>
          message.unread === false &&
          message.sender.id != currentUser.uid &&
          messages.indexOf(message) + 1 < messages.length &&
          message.lastSeenBy.every((user) => user.id === currentUser.uid)
      )
      .forEach((message) => {
        updateConversationMessage(uid, message.id, { lastSeenBy: [] });
      });

    messages
      ?.filter(
        (message) =>
          message.unread === true && message.sender.id != currentUser.uid
      )
      .forEach((message, index, arr) => {
        const updatedLastSeenBy =
          index === arr.length - 1
            ? [...message.lastSeenBy, currentUser.ref]
            : message.lastSeenBy;

        updateConversationMessage(uid, message.id, {
          unread: false,
          lastSeenBy: updatedLastSeenBy,
        });
      });
  }, [messagesData]);

  function updateConversationMessage(
    conversationId: string,
    messageId: string,
    data: any
  ) {
    updateDoc(
      doc(firebasedb, `conversations/${conversationId}/messages/${messageId}`),
      data
    );
  }

  return messages!;
}

function useContact(uid: string) {
  const { currentUser } = useContext(GlobalContext);
  const [contactName, setContactName] = useState("");

  const [conversationsData] = useCollection(
    query(
      collection(firebasedb, "conversations"),
      where("users", "array-contains", currentUser.ref || "")
    )
  );

  const conversation = conversationsData?.docs
    .map(
      (conversations) =>
        ({
          uid: conversations.id,
          ...conversations.data(),
        } as IConversationData)
    )
    .find((conversation) => conversation.uid === uid);

  const [contact] = useDocumentData(
    conversation?.users.find((conversationUser) => {
      return conversationUser.id != currentUser.uid;
    })
  );

  useEffect(() => {
    setContactName(contact?.name);
  }, [contact]);

  return { contactName };
}

export default function Page({ params }: { params: IParams }) {
  const { uid } = params;
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const messages = useMessages(uid);
  const { contactName } = useContact(uid);
  const { currentUser } = useContext(GlobalContext);

  useEffect(() => {
    textInput.current?.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key == "Enter" && !event.shiftKey) {
        event.preventDefault();
        (event.target as HTMLTextAreaElement).form?.requestSubmit();
      }
    });
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const regex = /^[\r\n\s]*$/g;

    if (textInput.current?.value.match(regex)) return;

    const text = textInput.current!.value;
    textInput.current!.value = "";

    await messageService.send({
      conversationUid: uid,
      senderRef: currentUser.ref,
      text,
    });
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

    return rtf.format(difference, unit as Intl.RelativeTimeFormatUnit);
  }

  function getMessageStyle(
    message: IMessage,
    messageIndex: number,
    arraySize: number
  ): IMessageStyle {
    const style =
      message.sender.id === currentUser.uid
        ? { color: "ml-auto bg-violet-200 ", alignment: "pl-8", ref: null }
        : { color: "mr-auto bg-sky-200 ", alignment: "pr-8", ref: null };

    style.ref = messageIndex + 1 == arraySize ? lastMessageRef : (null as any);

    return style;
  }

  return (
    <div className="flex flex-col pl-2 pr-4 py-4 gap-2 h-full">
      <div className="flex gap-5 items-center border-b-[1px] pb-2 h-20">
        <div className="text-slate-100 bg-slate-500 rounded-full">
          <Icon icon="radix-icons:avatar" width="45" height="45" />
        </div>
        <p className="font-semibold">{contactName}</p>

        <Link href={`chatapp`}>
          <Icon icon="mdi:close" />
        </Link>
      </div>
      <div
        className="h-full px-4 overflow-y-hidden hover:overflow-y-auto transition-all scrollbar-thin scrollbar-track-transparent scrollbar-thumb-violet-200"
        style={{ scrollbarGutter: "stable " }}
      >
        <div className="flex flex-col gap-2 ">
          {messages?.map((message, index) => {
            return (
              <>
                <MessageBaloon
                  key={message.id}
                  message={message}
                  style={getMessageStyle(message, index, messages?.length)}
                />
              </>
            );
          })}
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
          ref={textInput}
        ></textarea>
        <button
          className="bg-violet-500 text-white font-semibold w-48 rounded-md hover:bg-violet-500/80"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
