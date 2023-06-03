"use client";
import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="flex flex-col items-center absolute top-1/2 left-1/2 translate-x-1/2">
      Loading...
      <CircularProgress />
    </div>
  );
}
