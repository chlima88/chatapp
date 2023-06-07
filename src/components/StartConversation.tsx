import { Icon } from "@iconify/react";
import { firebasedb } from "@/lib/db";
import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IUsers[]>([]);

  useEffect(() => {
    const users =
      usersData?.docs
        .map((user) => {
          return {
            uid: user.id,
            ref: user.ref,
            ...user.data(),
          } as unknown as IUsers;
        })
        .filter((user) => user.uid != currentUser.uid) || [];

    if (searchInput === "") {
      setFilteredUsers([...users, ...users, ...users, ...users, ...users]);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.name.toLowerCase().includes(searchInput.toLowerCase())
        )
      );
    }
  }, [currentUser.uid, searchInput, usersData]);

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

  function handleSearch(event: ChangeEvent<HTMLInputElement>): void {
    setSearchInput(event.target.value);
  }

  return display ? (
    <div
      className="flex flex-col items-center justify-center backdrop-blur-sm ins absolute z-10 bg-slate-950/70 w-full h-screen"
      onClick={CloseModal}
    >
      <div
        className="bg-white px-2 py-4 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between px-4 py-2">
          <p className="text-xl font-bold">Start conversation with...</p>
          <button
            className="text-violet-500 hover:text-violet-400 transition-colors"
            onClick={CloseModal}
          >
            <Icon icon="mdi:close-box" width="24" height="24" />
          </button>
        </div>
        <div className="relative flex items-center py-2 px-4 group">
          <Icon
            className="text-slate-400 absolute left-6"
            icon="material-symbols:search"
            width="20"
            height="20"
          />
          <input
            className="py-2 px-8 border-[1px] w-full rounded-sm"
            placeholder="Search..."
            onChange={handleSearch}
          />
          <Icon
            className="invisible group-focus-within:visible text-slate-400 absolute right-6"
            icon="iconamoon:close-light"
            width="24"
            height="24"
          />
        </div>
        <div
          className="w-full max-h-96 overflow-y-hidden hover:overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-violet-200"
          style={{ scrollbarGutter: "stable both-edges" }}
        >
          <div className="flex flex-col gap-3 py-4 px-2">
            {filteredUsers?.map((user, index) => (
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
                      <p className="text-xs text-slate-600">{user.email}</p>
                    </div>
                  </div>
                  <button
                    className="bg-violet-500 text-white rounded-md p-2 hover:bg-violet-400 transition-colors"
                    onClick={() => handleInvite(user.ref)}
                  >
                    Invite
                  </button>
                </div>
                {index + 1 != filteredUsers.length && (
                  <div className="bg-slate-200 h-[1px]"></div>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
