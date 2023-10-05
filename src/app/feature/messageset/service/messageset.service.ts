import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { MessagesetDomain } from '../domain/messageset.component';
import { MessagesetDispatcher } from '../state/messageset.dispatcher';

@Injectable({
  providedIn: 'root'
})
export class MessagesetService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private messagesetDispatcher: MessagesetDispatcher
  ) { }

  getMessageset() {
    return this.http.get<CustomHttpResponse<MessagesetDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MESSAGESET_GET_PATH}`);
  }

  getMessagesetQuery(data: any) {
    return this.http.post<CustomHttpResponse<MessagesetDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MESSAGESET_GET_QUERY_PATH}`, data);
  }

  addMessageset(data: MessagesetDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MESSAGESET_ADD_PATH}`, data);
  }

  updateMessageset(currentName: string, data: MessagesetDomain) {
    const params = new HttpParams()
      .set('currentMessagesetName', currentName)
      .append('messagesetName', data.messagesetName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MESSAGESET_UPDATE_PATH}`, '', {params});
  }

  deleteMessageset(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MESSAGESET_DELETE_PATH}/${id}`);
  }

  onFetchMessageset() {
    this.messagesetDispatcher._MessagesetGet()
  }

  onFetchMessagesetQuery(data: any) {
    this.messagesetDispatcher._MessagesetGetQuery(data)
  }

  onAddMessageset(data: MessagesetDomain) {
    this.messagesetDispatcher._MessagesetAdd(data)
  }

  onUpdateMessageset(currentName: string, data: MessagesetDomain) {
    this.messagesetDispatcher._MessagesetUpdate(currentName, data)
  }

  onDeleteMessageset(id: number) {
    this.messagesetDispatcher._MessagesetDelete(id)
  }

}
