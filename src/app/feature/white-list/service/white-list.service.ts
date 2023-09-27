import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {WhiteListDomain} from "../domain/white-list.domain";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {WhiteListDispatcher} from "../state/white-list.dispatcher";
import {StateContext} from "@ngxs/store";
import {WhiteListStateModel} from "../state/white-list.state";

@Injectable({
  providedIn: 'root'
})
export class WhiteListService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private whiteListDispatcher: WhiteListDispatcher
  ) { }

  getWhiteList() {
    return this.http.get<CustomHttpResponse<WhiteListDomain[]>>(`${this.apiUrl}/${RoutePathEnum.WHITE_LIST_GET_PATH}`);
  }

  getWhiteListQuery(data: any) {
    return this.http.post<CustomHttpResponse<WhiteListDomain[]>>(`${this.apiUrl}/${RoutePathEnum.WHITE_LIST_GET_QUERY_PATH}`, data);
  }

  addWhiteList(data: WhiteListDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.WHITE_LIST_ADD_PATH}`, data);
  }

  updateWhiteList(currentId: number, data: WhiteListDomain) {
    const params = new HttpParams().set('currentId', currentId);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.WHITE_LIST_UPDATE_PATH}`, data, {params});
  }

  deleteWhiteList(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.WHITE_LIST_DELETE_PATH}/${id}`);
  }

  upload(data: {file: any, initiatorId: string, uGroupId: string}) {
    const formData = new FormData()
    formData.set('file', data.file, data.file.name)
    formData.set('initiatorId', data.initiatorId)
    formData.set('uGroupId', data.uGroupId)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.WHITE_LIST_UPLOAD_PATH}`, formData)
  }

  onFetchWhiteList() {
    this.whiteListDispatcher._WhiteListGet()
  }

  onFetchWhiteListQuery(data: any) {
    return this.whiteListDispatcher._WhiteListGetQuery(data)
  }

  onAddWhiteList(data: WhiteListDomain) {
    this.whiteListDispatcher._WhiteListAdd(data)
  }

  onUpdateWhiteList(currentId: number, data: WhiteListDomain) {
    this.whiteListDispatcher._WhiteListUpdate(currentId, data)
  }

  onDeleteWhiteList(id: number) {
    this.whiteListDispatcher._WhiteListDelete(id)
  }

  onUpload(data: {file: any, initiatorId: string, uGroupId: string}) {
    this.whiteListDispatcher._WhiteListUpload(data)
  }

  onGetAllInformation(action: (ctx: StateContext<WhiteListStateModel>) => void) {
    this.whiteListDispatcher._WhiteListGetAllInformation(action)
  }
}
