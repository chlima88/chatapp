"use client";
import { redirect } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/db";
import Loading from "@/components/Loading";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  if (!user) redirect("/login");

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-row ">
      <Sidebar />
      <div className="h-screen bg-slate-200 w-[1px]"></div>
      <div className="w-full h-screen">{children}</div>
    </div>
  );
}
