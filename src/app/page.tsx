"use client";
import { GlobalContext } from "@/context/GlobalContext";
import { redirect, useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const { userSession } = useContext(GlobalContext);
  const router = useRouter();

  return userSession ? router.push("/chatapp") : redirect("/login");
}
