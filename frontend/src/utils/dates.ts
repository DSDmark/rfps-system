import { MAIN_DATE_FORMAT, MAIN_TIME_FORMAT } from "@/constants";
import moment, { type Moment } from "moment-timezone";

export const getTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

export function formatDateUtil(
  dateString: string | Date | Moment | null | undefined,
  flag?: "time" | "date" | string,
  formatDate: string = MAIN_DATE_FORMAT,
): string {
  if (!dateString) return "";

  const tz =
    Intl.DateTimeFormat().resolvedOptions().timeZone || moment.tz.guess();
  let m: Moment;
  if (moment.isMoment(dateString)) {
    m = dateString.clone();
  } else {
    m = moment(dateString);
  }
  const dateTime = m.clone().tz(tz);
  if (flag === "time") {
    return dateTime.format(MAIN_TIME_FORMAT);
  }

  if (flag === "date") {
    return dateTime.format(formatDate);
  }

  return `${dateTime.format(formatDate)} ${dateTime.format(MAIN_TIME_FORMAT)}`;
}
