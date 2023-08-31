"use client";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/db";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";
import { GlobalContext } from "@/context/GlobalContext";
import { useContext } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userSession, userLoading, currentUser } = useContext(GlobalContext);

  if (!userSession) redirect("/login");

  return userLoading ? (
    // <Loading />
    <div>Chatapp layout</div>
  ) : (
    <div className="flex flex-row ">
      <Sidebar />
      <div className="h-screen bg-slate-200 w-[1px]"></div>
      <div className="w-full h-screen">{children}</div>
    </div>
  );
}
