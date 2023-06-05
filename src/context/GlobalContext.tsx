"use client";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface CurrentUser {
  uid: string;
  name: string;
  email: string;
  firstLogin: boolean;
  ref: DocumentReference<DocumentData>;
}

interface IGlobalContext {
  currentUser: CurrentUser;
  setCurrentUser: Dispatch<SetStateAction<CurrentUser>>;
}

const GlobalContext = createContext({} as IGlobalContext);

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(
    {} as CurrentUser
  );

  return (
    <GlobalContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
