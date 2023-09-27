import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {RecipientSetupDomain} from "../domain/recipient-setup.domain";
import {RecipientSetupDispatcher} from "../state/recipient-setup.dispatcher";
import {StateContext} from "@ngxs/store";
import {RecipientSetupStateModel} from "../state/recipient-setup.state";

@Injectable({
  providedIn: 'root'
})
export class RecipientSetupService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private recipientSetupDispatcher: RecipientSetupDispatcher
  ) { }

  getRecipientSetup() {
    return this.http.get<CustomHttpResponse<RecipientSetupDomain[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_SETUP_GET_PATH}`);
  }

  getRecipientSetupQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_SETUP_GET_QUERY_PATH}`, data);
  }

  addRecipientSetup(data: RecipientSetupDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_SETUP_ADD_PATH}`, data);
  }

  updateRecipientSetup(currentId: number, data: RecipientSetupDomain) {
    const params = new HttpParams().set('currentId', currentId);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_SETUP_UPDATE_PATH}`, data, {params});
  }

  deleteRecipientSetup(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.NOTIFICATION_RECIPIENT_SETUP_DELETE_PATH}/${id}`);
  }

  onFetchRecipientSetup() {
    this.recipientSetupDispatcher._RecipientSetupGet()
  }

  onFetchRecipientSetupQuery(data: any) {
    this.recipientSetupDispatcher._RecipientSetupGetQuery(data)
  }

  onAddRecipientSetup(data: RecipientSetupDomain) {
    this.recipientSetupDispatcher._RecipientSetupAdd(data)
  }

  onUpdateRecipientSetup(currentId: number, data: RecipientSetupDomain) {
    this.recipientSetupDispatcher._RecipientSetupUpdate(currentId, data)
  }

  onDeleteRecipientSetup(id: number) {
    this.recipientSetupDispatcher._RecipientSetupDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<RecipientSetupStateModel>) => void) {
    this.recipientSetupDispatcher._RecipientSetupGetAllInformation(action)
  }
}
