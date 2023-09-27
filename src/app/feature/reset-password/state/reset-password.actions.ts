export class ResetPassword {
  static readonly type = '[ResetPassword] ResetPassword'
  constructor(public username: string, public data: {currentPass: string, newPass: string}) {
  }
}
