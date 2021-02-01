import { format } from "date-fns";

export function formatTime(time: Date) {
  return format(time, "h:mm a");
}

export function formatDate(date: Date) {
  return format(date, "MM-dd-yyyy");
}
