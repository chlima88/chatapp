"use client";

import { GlobalContext } from "@/context/GlobalContext";
import { ICurrentUser, IMessage, IMessageStyle } from "@/lib/types";
import { Icon } from "@iconify/react";
import { useContext } from "react";

type Props = {
  message: IMessage;
  style: IMessageStyle;
};

function getRelativeTime(timestamp: number) {
  const MINUTE_MILLISECONDS = 1000 * 60;
  const HOUR_MILLISECONDS = MINUTE_MILLISECONDS * 60;
  const DAY_MILLISECONDS = HOUR_MILLISECONDS * 24;
  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  function getTimeDiff(timestamp: number, multplier: number) {
    return Math.round((new Date().getTime() - timestamp) / multplier) * -1;
  }

  let unit;
  let difference = getTimeDiff(timestamp, DAY_MILLISECONDS);

  if (difference > 7) {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(timestamp);
  } else {
    unit = "day";
  }

  if (difference === 0) {
    difference = getTimeDiff(timestamp, HOUR_MILLISECONDS);
    unit = "hour";
  }

  if (difference === 0) {
    difference = getTimeDiff(timestamp, MINUTE_MILLISECONDS);
    unit = "minute";
  }

  return rtf.format(difference, unit as Intl.RelativeTimeFormatUnit);
}

function setAsRead(currentUser: ICurrentUser, message: IMessage) {
  if (
    message.sender.id == currentUser.uid &&
    message.lastSeenBy.filter((user) => user.id != currentUser.uid) &&
    message.lastSeenBy?.length > 0
  )
    return <Icon className={"inline mr-2"} icon="fluent:eye-24-filled" />;
  else {
    return "";
  }
}

export default function MessageBaloon({ message, style }: Props) {
  const { currentUser } = useContext(GlobalContext);

  return (
    <div className={"w-full" + ` ${style.alignment}`} key={message.id}>
      <div
        className={"p-2 rounded-md w-fit max-w-2xl " + `${style.color}`}
        ref={style.ref}
      >
        <div>{message.text}</div>
        <div
          className={"text-xs text-slate-500 text-right"}
          title={new Intl.DateTimeFormat(["pt-BR"], {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }).format(message.timestamp?.toDate().getTime())}
        >
          {setAsRead(currentUser, message)}
          {message.timestamp &&
            getRelativeTime(message.timestamp.toDate().getTime())}
        </div>
      </div>
    </div>
  );
}
