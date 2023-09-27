export class DateUtils {
  static GiveGreetingByCurrentTime(): string {
    const hours = new Date().getHours();
    if (hours < 12){
      return  'Good Morning';
    } else if (hours >= 12 && hours <= 17) {
      return  'Good Afternoon';
    } else if (hours >= 17 && hours <= 24) {
      return  'Good Evening';
    }
    return ''
  }

  static ConvertToTimestampFormat(rawValue: string) {
    const date = new Date(rawValue)
    const timestampString = date.toISOString();
    return timestampString.slice(0, 10) + 'T' + timestampString.slice(11, 19) + 'Z';
  }

  static ConvertToTimestampFormatV2(rawValue: string) {
    const timestamp = new Date(rawValue);
    const isoString = timestamp.toISOString();
    return isoString.replace('T', ' ').replace('Z', '');
  }

  static ConvertToTimestampFormatV3(rawValue: string) {
    const date = new Date(rawValue);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const milliseconds = ("00" + date.getMilliseconds()).slice(-3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  static ConvertToDateFormat(rawValue: any) {
    if (rawValue != '' && rawValue != undefined) {
      const date = new Date(rawValue)
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      const second = date.getSeconds().toString().padStart(2, '0');

      return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
    } else {
      return ''
    }
  }

  static timeChecker(time: string) {
    const currentTime = new Date();

    const targetTime = new Date(time);

    const timeDifference = currentTime.getTime() - targetTime.getTime();

    const seconds = Math.floor(timeDifference / 1000);

    const minutesAgo = Math.floor(seconds / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(daysAgo / 30.4375);
    const yearsAgo = Math.floor(daysAgo / 365.25);

    if (yearsAgo > 0) {
      return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
    } else if (monthsAgo > 0) {
      return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    } else if (weeksAgo > 0) {
      return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
    } else if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
  }
}
