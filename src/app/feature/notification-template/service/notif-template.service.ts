import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {NotifTemplateDomain} from "../domain/notif-template.domain";
import {NotifTemplateDispatcher} from "../state/notif-template.dispatcher";
import {StateContext} from "@ngxs/store";
import {NotifTemplateStateModel} from "../state/notif-template.state";

@Injectable({
  providedIn: 'root'
})
export class NotifTemplateService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private notifTemplateDispatcher: NotifTemplateDispatcher
  ) { }

  getNotifTemplate() {
    return this.http.get<CustomHttpResponse<NotifTemplateDomain[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_TEMPLATE_SETUP_GET_PATH}`);
  }

  getNotifTemplateQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_TEMPLATE_SETUP_GET_QUERY_PATH}`, data);
  }

  addNotifTemplate(data: NotifTemplateDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_TEMPLATE_SETUP_ADD_PATH}`, data);
  }

  updateNotifTemplate(currentId: number, data: NotifTemplateDomain) {
    const params = new HttpParams().set('currentId', currentId);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_TEMPLATE_SETUP_UPDATE_PATH}`, data, {params});
  }

  deleteNotifTemplate(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_TEMPLATE_SETUP_DELETE_PATH}/${id}`);
  }

  onFetchNotifTemplate() {
    this.notifTemplateDispatcher._NotifTemplateGet()
  }

  onFetchNotifTemplateQuery(data: any) {
    this.notifTemplateDispatcher._NotifTemplateGetQuery(data);
  }

  onAddNotifTemplate(data: NotifTemplateDomain) {
    this.notifTemplateDispatcher._NotifTemplateAdd(data)
  }

  onUpdateNotifTemplate(currentId: number, data: NotifTemplateDomain) {
    this.notifTemplateDispatcher._NotifTemplateUpdate(currentId, data)
  }

  onDeleteNotifTemplate(id: number) {
    this.notifTemplateDispatcher._NotifTemplateDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<NotifTemplateStateModel>) => void) {
    this.notifTemplateDispatcher._NotifTemplateGetAllInformation(action)
  }
}
