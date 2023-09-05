"use client";
import Loading from "@/components/Loading";
import { auth, firebasedb } from "@/lib/db";
import { IConversation, ICurrentUser } from "@/lib/types";
import { User } from "firebase/auth";
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
} from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";

interface IGlobalContext {
  userSession: User | null | undefined;
  userLoading: boolean;
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
  const [userSession, setUserSession] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUserSession(user);
      setUserLoading(false);

      if (!!user) {
        const currentUserRef = doc(firebasedb, "users", user?.uid as string);

        (async function () {
          const userData = await getDoc(
            doc(firebasedb, "users", user?.uid as string)
          );

          setCurrentUser({
            uid: userData?.id ?? user?.uid,
            name: userData?.data()?.name ?? user?.email?.split("@")[0],
            email: userData?.data()?.email ?? user?.email,
            firstLogin: userData?.data()?.firstLogin ?? true,
            ref: currentUserRef,
          });
        })();
      }
    });
  }, []);

  if (!userSession) {
    // <div>No session</div>
    // redirect("/login");
  }

  return userLoading ? (
    // <div>Global ctx</div>
    <Loading />
  ) : (
    <GlobalContext.Provider
      value={{
        userSession,
        userLoading,
        currentUser,
        setCurrentUser,
        conversations,
        setConversations,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
