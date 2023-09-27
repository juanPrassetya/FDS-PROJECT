import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BlackListDispatcher} from "../state/black-list.dispatcher";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {BlackListDomain} from "../domain/black-list.domain";
import {StateContext} from "@ngxs/store";
import {BlackListStateModel} from "../state/black-list.state";

@Injectable({
  providedIn: 'root'
})
export class BlackListService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private blackDispatcher: BlackListDispatcher
  ) { }

  getBlackList() {
    return this.http.get<CustomHttpResponse<BlackListDomain[]>>(`${this.apiUrl}/${RoutePathEnum.BLACK_LIST_GET_PATH}`);
  }

  getBlackListQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.BLACK_LIST_GET_QUERY_PATH}`, data);
  }

  addBlackList(data: BlackListDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BLACK_LIST_ADD_PATH}`, data);
  }

  updateBlackList(currentId: number, data: BlackListDomain) {
    const params = new HttpParams().set('currentId', currentId);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BLACK_LIST_UPDATE_PATH}`, data, {params});
  }

  deleteBlackList(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BLACK_LIST_DELETE_PATH}/${id}`);
  }

  upload(data: {file: any, initiatorId: string, uGroupId: string}) {
    const formData = new FormData()
    formData.set('file', data.file, data.file.name)
    formData.set('initiatorId', data.initiatorId)
    formData.set('uGroupId', data.uGroupId)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BLACK_LIST_UPLOAD_PATH}`, formData)
  }

  onFetchBlackList() {
    this.blackDispatcher._BlackListGet()
  }

  onFetchBlackListQuery(data: any) {
    this.blackDispatcher._BlackListGetQuery(data)
  }

  onAddBlackList(data: BlackListDomain) {
    this.blackDispatcher._BlackListAdd(data)
  }

  onUpdateBlackList(currentId: number, data: BlackListDomain) {
    this.blackDispatcher._BlackListUpdate(currentId, data)
  }

  onDeleteBlackList(id: number) {
    this.blackDispatcher._BlackListDelete(id)
  }

  onUpload(data: {file: any, initiatorId: string, uGroupId: string}) {
    this.blackDispatcher._BlackListUpload(data)
  }

  onGetAllInformation(action: (ctx: StateContext<BlackListStateModel>) => void) {
    this.blackDispatcher._BlackListGetAllInformation(action)
  }
}
