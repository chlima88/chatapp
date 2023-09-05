import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";
import { RefObject } from "react";

export type IUser = {
  uid: string;
  ref: DocumentReference<DocumentData>;
  name: string;
  email: string;
};

export type ICurrentUser = {
  uid: string;
  name: string;
  email: string;
  firstLogin: boolean;
  ref: DocumentReference<DocumentData>;
};

export interface IConversation {
  uid: string;
  contactRef: DocumentReference<DocumentData>;
  name: string;
  email: string;
}

export type IConversationData = {
  uid: string;
  participants: string[];
  created_at: string;
  users: DocumentReference<DocumentData>[];
};

export type IMessage = {
  id: string;
  sender: DocumentReference<DocumentData>;
  timestamp: Timestamp;
  text: string;
  unread: boolean;
  lastSeenBy: DocumentReference<DocumentData>[];
};

export type IMessageStyle = {
  color: string;
  alignment: string;
  ref: RefObject<HTMLDivElement> | null;
};
