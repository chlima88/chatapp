"use client";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  where,
  DocumentReference,
  DocumentData,
  getDoc,
  doc,
} from "firebase/firestore";
import { firebasedb } from "@/lib/db";
import { UserContext } from "@/context/UserContext";
import Conversation from "./Conversation";
import { useContext, useEffect, useState } from "react";

interface IConversation extends DocumentData {
  uid: string;
  participants: string[];
  users: DocumentReference<DocumentData>[];
  created_at: string;
}

interface IContact {
  uid: string;
  name: string;
  email: string;
}

export default function ConversationList() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [contacts, setContacts] = useState<Array<IContact>>([]);

  const [conversationsData] = useCollectionData(
    query(
      collection(firebasedb, "conversations"),
      where("users", "array-contains", currentUser.ref)
    )
  );

  useEffect(() => {
    Promise.all(
      conversationsData?.map(async ({ users }) => {
        const contactRef = users.find(
          (userRef: { id: string }) => userRef.id != currentUser.uid
        );
        const contact = await getDoc(
          doc(firebasedb, "users", contactRef?.id as string)
        );
        return contact.data() as IContact;
      }) || []
    ).then((data) => setContacts(data));
  }, [conversationsData, currentUser.uid]);

  return (
    contacts && (
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col">
          {contacts?.map((contact, index) => (
            <>
              <Conversation
                key={contact.uid}
                displayName={contact.name}
                uid={contact.uid}
              />
              {index + 1 != contacts.length && (
                <div className="w-full bg-slate-200 h-[1px]"></div>
              )}
            </>
          ))}
        </div>
      </div>
    )
  );
}
