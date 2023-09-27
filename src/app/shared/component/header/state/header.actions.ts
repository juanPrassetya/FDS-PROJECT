export class UserNotificationGet {
  static readonly type = '[UserHeader] UserNotificationGet'

  constructor(
    public userId: number
  ) {
  }
}
