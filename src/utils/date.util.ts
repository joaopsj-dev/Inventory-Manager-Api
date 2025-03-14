export class DateUtil {
  static adjustTimezone(date: Date, hoursOffset: number): Date {
    const adjustedDate = new Date(date);
    adjustedDate.setUTCHours(adjustedDate.getUTCHours() + hoursOffset);
    return adjustedDate;
  }
}
