import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {NotifTypeDomain} from "../domain/notif-type.domain";
import {NotifTypeDispatcher} from "../state/notif-type.dispatcher";

@Injectable({
  providedIn: 'root'
})
export class NotifTypeService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private notifTypeDispatcher: NotifTypeDispatcher
  ) { }

  getNotificationType() {
    return this.http.get<CustomHttpResponse<NotifTypeDomain[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_TYPE_GET_PATH}`);
  }

  onGetNotificationType() {
    this.notifTypeDispatcher._NotificationTypeGet()
  }
}
