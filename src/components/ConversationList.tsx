"use client";
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
import { UserContext } from "@/context/UserContext";
import Conversation from "./Conversation";
import { useContext } from "react";

interface IConversation {
  uid: string;
  participants: string[];
  users: any[];
  created_at: string;
}

export default function ConversationList() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [snapshot, loading, error] = useCollection(
    collection(firebasedb, "conversations")
  );
  const conversations = snapshot?.docs.map(
    (doc) => ({ uid: doc.id, ...doc.data() } as IConversation)
  );

  return (
    <div className="overflow-y-auto h-full">
      <div className="flex flex-col">
        {conversations?.map(({ uid, participants }, index) => {
          const contactEmail =
            participants.find(
              (participant: string) => participant != currentUser.email
            ) || "";
          return (
            <>
              <Conversation key={uid} email={contactEmail} uid={uid} />
              {index + 1 != conversations.length && (
                <div className="w-full bg-slate-200 h-[1px]"></div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
