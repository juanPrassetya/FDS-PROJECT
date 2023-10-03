import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { KeysDomain } from '../domain/keys.component';
import { KeysDispatcher } from '../state/keys.dispatcher';

@Injectable({
  providedIn: 'root'
})
export class KeysService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private keysDispatcher: KeysDispatcher
  ) { }

  getKeys() {
    return this.http.get<CustomHttpResponse<KeysDomain[]>>(`${this.apiUrl}/${RoutePathEnum.KEYS_GET_PATH}`);
  }

  getKeysQuery(data: any) {
    return this.http.post<CustomHttpResponse<KeysDomain[]>>(`${this.apiUrl}/${RoutePathEnum.KEYS_GET_QUERY_PATH}`, data);
  }

  addKeys(data: KeysDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.KEYS_ADD_PATH}`, data);
  }

  updateKeys(currentName: string, data: KeysDomain) {
    const params = new HttpParams()
      .set('currentKeysName', currentName)
      .append('keysName', data.keysName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.KEYS_UPDATE_PATH}`, '', {params});
  }

  deleteKeys(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.KEYS_DELETE_PATH}/${id}`);
  }

  onFetchKeys() {
    this.keysDispatcher._KeysGet()
  }

  onFetchKeysQuery(data: any) {
    this.keysDispatcher._KeysGetQuery(data)
  }

  onAddKeys(data: KeysDomain) {
    this.keysDispatcher._KeysAdd(data)
  }

  onUpdateKeys(currentName: string, data: KeysDomain) {
    this.keysDispatcher._KeysUpdate(currentName, data)
  }

  onDeleteKeys(id: number) {
    this.keysDispatcher._KeysDelete(id)
  }

}
