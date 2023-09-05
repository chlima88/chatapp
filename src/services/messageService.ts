import {
  useCollectionData,
  useCollection,
  useDocumentData,
} from "react-firebase-hooks/firestore";

import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  DocumentReference,
  DocumentData,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firebasedb } from "@/lib/db";

type Message = {
  conversationUid: string;
  senderRef: DocumentReference<DocumentData>;
  text: string;
};

class MessageService {
  async send({ senderRef, conversationUid, text }: Message) {
    await addDoc(
      collection(firebasedb, `conversations/${conversationUid}/messages`),
      {
        text,
        sender: senderRef,
        timestamp: serverTimestamp(),
        unread: true,
        lastSeenBy: [],
      }
    );
  }
}

export const messageService = new MessageService();
