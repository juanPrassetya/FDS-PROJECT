export class AuthLogin {
  static readonly type = '[Auth] Login'
  constructor(public username: string, public password: string) {
  }
}

export class AuthLogout {
  static readonly type = '[Auth] Logout'
}

export class AuthGetUserData {
  static readonly type = '[Auth] GetUserData'
}

export class AuthTokenRefresh {
  static readonly type = '[Auth] TokenRefresh'
}
