import {Injectable} from "@angular/core";
import {JwtHelperService} from "@auth0/angular-jwt";
import {CustomHttpResponse} from "../domain/customHttpResponse";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserDomain} from "../../feature/user/domain/user.domain";
import {AuthDispatcher} from "../auth/state/auth.dispatcher";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.dev_env
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private authDispatcher: AuthDispatcher
  ) {
  }

  login(data: { username: string, password: string }) {
    return this.http.post<CustomHttpResponse<UserDomain>>(`${this.apiUrl}/login`, data, {observe: `response`})
  }

  loadCurrentUserBySub() {
    return this.http.get<CustomHttpResponse<UserDomain>>(`${this.apiUrl}/user/find/${this.getSub()}`);
  }

  refreshToken() {
    return this.http.get<CustomHttpResponse<any>>(`${this.apiUrl}/token/refresh`, {observe: `response`})
  }

  onLogin(data: { username: string, password: string }) {
    this.authDispatcher._AuthLogin(data.username, data.password)
  }

  onGetToken(httpResponse: HttpResponse<any>): { rt: string | null; at: string | null } {
    const accessToken = httpResponse.headers.get('Jwt-Token')
    const refreshToken = httpResponse.headers.get('Refresh-Token')

    return {
      at: accessToken,
      rt: refreshToken
    };
  }

  saveToken(token: { rt: string | null; at: string | null }) {
    if (token.rt != null) localStorage.setItem("rt", token.rt)
    if (token.at != null) localStorage.setItem("at", token.at)
  }

  removeToken() {
    localStorage.removeItem("rt")
    localStorage.removeItem("at")
  }

  loadAT(): string {
    return localStorage.getItem("at") || ''
  }

  loadRT(): string {
    return localStorage.getItem("rt") || ''
  }

  getAuthorities() {
    return this.jwtHelper.decodeToken(this.loadAT()).authorities as string[]
  }

  getSub() {
    return this.jwtHelper.decodeToken(this.loadAT()).sub as string
  }

  getUserRole(token: string | null) {
    if (token != null) {
      const roles: string[] = this.jwtHelper.decodeToken(token).authorities
      return roles.filter(data => data.startsWith('ROLE_'))[0]
    }

    return
  }

  getUserOperation(token: string | null) {
    if (token != null) {
      const operations: string[] = this.jwtHelper.decodeToken(token).authorities
      return operations.filter(data => data.includes('_OP_'))
    }

    return []
  }

  isNeedToResetPass() {
    return
  }

  //Expired time of the token will be checked in backend side
  isAuthenticated(): boolean {
    const token = this.loadAT()
    if (token != null && token != '') {
      if (this.jwtHelper.decodeToken(token).sub != null || '') {
        return true
      } else {
        this.removeToken()
        return false //This block will run when the decoded token not having sub/username
      }
    } else {
      this.removeToken()
      return false //This block will run when the token is null from local storage
    }
  }

  onGetUserData() {
    this.authDispatcher._AuthGetUserData()
  }

  onLogout() {
    this.authDispatcher._AuthLogout()
  }
}
