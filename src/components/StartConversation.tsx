import { Icon } from "@iconify/react";
import { firebasedb } from "@/lib/db";
import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { Dispatch, SetStateAction, useContext } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { GlobalContext } from "@/context/GlobalContext";

interface IProps {
  display: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
}

interface IUsers {
  uid: string;
  ref: DocumentSnapshot<DocumentData>;
  name: string;
  email: string;
}

export default function StartConversation({ display, toggle }: IProps) {
  const [usersData] = useCollection(collection(firebasedb, "users"));
  const { currentUser } = useContext(GlobalContext);
  const users = usersData?.docs
    .map((user) => {
      return {
        uid: user.id,
        ref: user.ref,
        ...user.data(),
      } as unknown as IUsers;
    })
    .filter((user) => user.uid != currentUser.uid);

  function CloseModal(): void {
    toggle(false);
  }

  async function handleInvite(userRef: DocumentSnapshot<DocumentData>) {
    await addDoc(collection(firebasedb, "conversations"), {
      users: [currentUser.ref, userRef],
      created_at: serverTimestamp(),
    });
    toggle(false);
  }

  return display ? (
    <div
      className="flex flex-col items-center justify-center backdrop-blur-sm ins absolute z-10 bg-slate-950/70 w-full h-screen"
      onClick={CloseModal}
    >
      <div className="bg-white p-2 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between px-4 py-2">
          <p className="text-xl font-bold">Iniciar conversa com...</p>
          <button
            className="text-violet-500 hover:text-violet-400 transition-colors"
            onClick={CloseModal}
          >
            <Icon icon="mdi:close-box" width="24" height="24" />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-4">
          {users?.map((user, index) => (
            <>
              <div
                className="flex flex-row items-center justify-between"
                key={user.uid}
              >
                <div className="flex flex-row gap-3">
                  <div className="text-slate-100 bg-slate-500 rounded-full ">
                    <Icon icon="radix-icons:avatar" width="40" height="40" />
                  </div>
                  <div className="">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-400 transition-colors"
                  onClick={() => handleInvite(user.ref)}
                >
                  Invite
                </button>
              </div>
              {index + 1 != users.length && (
                <div className="bg-slate-200 h-[1px]"></div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
