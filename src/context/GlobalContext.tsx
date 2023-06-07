"use client";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface ICurrentUser {
  uid: string;
  name: string;
  email: string;
  firstLogin: boolean;
  ref: DocumentReference<DocumentData>;
}

interface IConversation {
  uid: string;
  contactRef: DocumentReference<DocumentData>;
  name: string;
  email: string;
}

interface IGlobalContext {
  currentUser: ICurrentUser;
  setCurrentUser: Dispatch<SetStateAction<ICurrentUser>>;
  conversations: IConversation[];
  setConversations: Dispatch<SetStateAction<IConversation[]>>;
}

const GlobalContext = createContext({} as IGlobalContext);

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<ICurrentUser>(
    {} as ICurrentUser
  );

  const [conversations, setConversations] = useState<IConversation[]>([]);

  return (
    <GlobalContext.Provider
      value={{ currentUser, setCurrentUser, conversations, setConversations }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
