import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { MappingDomain } from '../domain/mapping.domain';
import { MappingDispatcher } from '../state/mapping.dispatcher';
@Injectable({
  providedIn: 'root'
})
export class MappingService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private mappingDispatcher: MappingDispatcher
  ) { }

  getMapping() {
    return this.http.get<CustomHttpResponse<MappingDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MAPPING_GET_PATH}`);
  }

  getMappingQuery(data: any) {
    return this.http.post<CustomHttpResponse<MappingDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MAPPING_GET_QUERY_PATH}`, data);
  }

  addMapping(data: MappingDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MAPPING_ADD_PATH}`, data);
  }

  updateMapping(currentName: string, data: MappingDomain) {
    const params = new HttpParams()
      .set('currentMappingName', currentName)
      .append('mappingName', data.mappingName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MAPPING_UPDATE_PATH}`, '', {params});
  }

  deleteMapping(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MAPPING_DELETE_PATH}/${id}`);
  }

  onFetchMapping() {
    this.mappingDispatcher._MappingGet()
  }

  onFetchMappingQuery(data: any) {
    this.mappingDispatcher._MappingGetQuery(data)
  }

  onAddMapping(data: MappingDomain) {
    this.mappingDispatcher._MappingAdd(data)
  }

  onUpdateMapping(currentName: string, data: MappingDomain) {
    this.mappingDispatcher._MappingUpdate(currentName, data)
  }

  onDeleteMapping(id: number) {
    this.mappingDispatcher._MappingDelete(id)
  }

}
