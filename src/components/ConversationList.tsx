"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCollection,
  useCollectionData,
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
import Conversation from "./Conversation";

interface IConversation {
  id: string;
  participants: string[];
  users: any[];
  created_at: string;
}

export default function ConversationList() {
  const pathname = usePathname();

  // const q = query(
  //   collection(firebasedb, "conversations"),
  //   where("participants", "array-contains", "clima@google.com")
  // );
  // const [conversations] = useCollectionData(q);

  const [snapshot, loading, error] = useCollection(
    collection(firebasedb, "conversations")
  );
  const conversations = snapshot?.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as IConversation)
  );

  return (
    <div className="overflow-y-auto h-full">
      <div className="flex flex-col">
        {conversations?.map(({ id, participants }, index) => {
          const contactEmail =
            participants.find(
              (participant: string) => participant != "clima@google.com"
            ) || "";
          return (
            <>
              <Conversation key={id} email={contactEmail} id={id} />
              {index + 1 != conversations.length && (
                <div className="w-full bg-slate-200 h-[1px]"></div>
              )}
            </>
          );
        })}
        <Conversation email="vespa@redbull.com" />
        <div className="w-full bg-slate-200 h-[1px]"></div>
        <Conversation email="toto@mercedes.com" />
        <div className="w-full bg-slate-200 h-[1px]"></div>
        <Conversation email="horner@redbull.com" />
        <div className="w-full bg-slate-200 h-[1px]"></div>
        <Conversation email="checo@redbull.com" />
        <div className="w-full bg-slate-200 h-[1px]"></div>
        <Conversation email="grussel@mercedes.com" />
        <div className="w-full bg-slate-200 h-[1px]"></div>
        <Conversation email="alonso@astonmartin.com" />
      </div>
    </div>
  );
}
