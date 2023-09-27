import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {HeaderDispatcher} from "../state/header.dispatcher";
import {CustomHttpResponse} from "../../../domain/customHttpResponse";
import {RoutePathEnum} from "../../../enum/route-path.enum";
import {UserNotificationDomain} from "../domain/user-notification.domain";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private headerDispatcher: HeaderDispatcher
  ) { }

  fetchUserNotification(userId: number) {
    return this.http.get<CustomHttpResponse<Array<UserNotificationDomain>>>(`${this.apiUrl}/${RoutePathEnum.USER_NOTIFICATION_GET_PATH}/${userId}/list`);
  }

  onFetchUserNotification(userId: number) {
    return this.headerDispatcher._UserNotificationGet(userId)
  }
}
