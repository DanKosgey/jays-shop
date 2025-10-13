"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

type TimeAgoProps = {
  date: Date | string;
};

export function TimeAgo({ date }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const newTimeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
    setTimeAgo(newTimeAgo);
    
    // Update the time every minute to keep it fresh
    const interval = setInterval(() => {
        const updatedTimeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });
        setTimeAgo(updatedTimeAgo);
    }, 60000);

    return () => clearInterval(interval);

  }, [date]);

  if (!timeAgo) {
    // Render a placeholder or nothing on the server
    return <p className="text-xs text-muted-foreground">calculating...</p>;
  }

  return <p className="text-xs text-muted-foreground">{timeAgo}</p>;
}
