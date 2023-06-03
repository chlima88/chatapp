"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";

interface CurrentUser {
  uid: string;
  name: string;
  email: string;
  firstLogin: boolean;
}

interface ICurrentUserContext {
  currentUser: CurrentUser;
  setCurrentUser: Dispatch<SetStateAction<CurrentUser>>;
}

const UserContext = createContext({} as ICurrentUserContext);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(
    {} as CurrentUser
  );

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
