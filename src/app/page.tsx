"use client";
import { GlobalContext } from "@/context/GlobalContext";
import { redirect, useRouter } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const { currentUser } = useContext(GlobalContext);
  const router = useRouter();

  return currentUser.email ? router.push("/chatapp") : redirect("/login");
}
