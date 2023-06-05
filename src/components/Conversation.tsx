"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface IProps {
  displayName: string;
  uid: string;
}

export default function Conversation({ displayName, uid }: IProps) {
  return (
    <Link href={`chatapp/conversations/${uid}`}>
      <div className="flex flex-row items-center justify-between p-2 hover:bg-sky-100 hover:cursor-pointer">
        <div className="flex flex-row  gap-2">
          <div className="text-slate-100 bg-slate-500 rounded-full">
            <Icon icon="radix-icons:avatar" width="40" height="40" />
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-semibold">{displayName}</div>
            <div className="text-xs">Parte da ultima mensagem recebida...</div>
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center">
            <div className="text-xs">12h ago</div>
            <div className="flex justify-center text-xs w-8 py-1 text-white font-semibold bg-red-500 rounded-full">
              9+
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
