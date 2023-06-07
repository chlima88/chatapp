"use client";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { firebasedb } from "@/lib/db";
import { GlobalContext } from "@/context/GlobalContext";
import Conversation from "./Conversation";
import { useContext, useEffect, useState } from "react";

interface IConversation {
  uid: string;
  contactRef: DocumentReference<DocumentData>;
  name: string;
  email: string;
}

export default function ConversationList({ filter }: { filter: string }) {
  const { currentUser, conversations, setConversations } =
    useContext(GlobalContext);
  const [filteredConversations, setFilteredConversations] = useState<
    IConversation[]
  >([]);

  const [conversationsData] = useCollection(
    query(
      collection(firebasedb, "conversations"),
      where("users", "array-contains", currentUser.ref)
    )
  );

  useEffect(() => {
    if (filter === "") {
      setFilteredConversations([...conversations]);
    } else {
      setFilteredConversations(
        conversations.filter(
          (conversation) =>
            conversation.email.toLowerCase().includes(filter.toLowerCase()) ||
            conversation.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, conversations]);

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
          contactRef,
          ...contact.data(),
        } as IConversation;
      }) || []
    ).then((data) => setConversations(data));
  }, [conversationsData, currentUser.uid, setConversations]);

  return (
    filteredConversations && (
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col">
          {filteredConversations?.map((conversation, index) => (
            <>
              <Conversation
                key={conversation.uid}
                displayName={conversation.name}
                uid={conversation.uid}
              />
              {index + 1 != filteredConversations.length && (
                <div className="w-full bg-slate-200 h-[1px]"></div>
              )}
            </>
          ))}
        </div>
      </div>
    )
  );
}
