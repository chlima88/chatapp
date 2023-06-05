"use client";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { firebasedb } from "@/lib/db";
import { UserContext } from "@/context/UserContext";
import Conversation from "./Conversation";
import { useContext, useEffect, useState } from "react";

interface IConversation {
  uid: string;
  name: string;
  email: string;
}

export default function ConversationList() {
  const { currentUser } = useContext(UserContext);
  const [conversations, setConversations] = useState<Array<IConversation>>([]);

  const [conversationsData] = useCollection(
    query(
      collection(firebasedb, "conversations"),
      where("users", "array-contains", currentUser.ref)
    )
  );

  useEffect(() => {
    Promise.all(
      conversationsData?.docs.map(async (conversation) => {
        const { id } = conversation;
        const { users } = conversation.data();
        const contactRef = users.find(
          (userRef: { id: string }) => userRef.id != currentUser.uid
        );
        const contact = await getDoc(
          doc(firebasedb, "users", contactRef?.id as string)
        );
        return {
          uid: id,
          ...contact.data(),
        } as IConversation;
      }) || []
    ).then((data) => setConversations(data));
  }, [conversationsData, currentUser.uid]);

  return (
    conversations && (
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col">
          {conversations?.map((conversation, index) => (
            <>
              <Conversation
                key={conversation.uid}
                displayName={conversation.name}
                uid={conversation.uid}
              />
              {index + 1 != conversations.length && (
                <div className="w-full bg-slate-200 h-[1px]"></div>
              )}
            </>
          ))}
        </div>
      </div>
    )
  );
}
