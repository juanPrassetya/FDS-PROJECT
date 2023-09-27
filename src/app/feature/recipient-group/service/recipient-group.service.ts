import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {RecipientGroupDomain} from "../domain/recipient-group.domain";
import {RecipientGroupDispatcher} from "../state/recipient-group.dispatcher";
import {StateContext} from "@ngxs/store";
import {RecipientGroupStateModel} from "../state/recipient-group.state";

@Injectable({
  providedIn: 'root'
})
export class RecipientGroupService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private recipientGroupDispatcher: RecipientGroupDispatcher
  ) { }

  getRecipientGroup() {
    return this.http.get<CustomHttpResponse<RecipientGroupDomain[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_GROUP_GET_PATH}`);
  }

  getRecipientGroupQuery(data: any) {
    return this.http.post<CustomHttpResponse<RecipientGroupDomain[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_GROUP_GET_QUERY_PATH}`, data);
  }

  addRecipientGroup(data: RecipientGroupDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_GROUP_ADD_PATH}`, data);
  }

  updateRecipientGroup(currentId: number, data: RecipientGroupDomain) {
    const params = new HttpParams().set('currentId', currentId);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_GROUP_UPDATE_PATH}`, data, {params});
  }

  deleteRecipientGroup(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_GROUP_DELETE_PATH}/${id}`);
  }

  onFetchRecipientGroup() {
    this.recipientGroupDispatcher._RecipientGroupGet()
  }

  onFetchRecipientGroupQuery(data: any) {
    this.recipientGroupDispatcher._RecipientGroupGetQuery(data)
  }

  onAddRecipientGroup(data: RecipientGroupDomain) {
    this.recipientGroupDispatcher._RecipientGroupAdd(data)
  }

  onUpdateRecipientGroup(currentId: number, data: RecipientGroupDomain) {
    this.recipientGroupDispatcher._RecipientGroupUpdate(currentId, data)
  }

  onDeleteRecipientGroup(id: number) {
    this.recipientGroupDispatcher._RecipientGroupDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<RecipientGroupStateModel>) => void) {
    this.recipientGroupDispatcher._RecipientGroupGetAllInformation(action)
  }
}
