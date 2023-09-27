import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {InstitutionDomain} from "../domain/institution.domain";
import {InstitutionDispatcher} from "../state/institution.dispatcher";

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private institutionDispatcher: InstitutionDispatcher
  ) { }

  getInstitution() {
    return this.http.get<CustomHttpResponse<InstitutionDomain[]>>(`${this.apiUrl}/${RoutePathEnum.INSTITUTION_GET_PATH}`);
  }

  getInstitutionQuery(data: any) {
    return this.http.post<CustomHttpResponse<InstitutionDomain[]>>(`${this.apiUrl}/${RoutePathEnum.INSTITUTION_GET_QUERY_PATH}`, data);
  }

  addInstitution(data: InstitutionDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.INSTITUTION_ADD_PATH}`, data);
  }

  updateInstitution(currentName: string, data: InstitutionDomain) {
    const params = new HttpParams()
      .set('currentInstitutionName', currentName)
      .append('institutionName', data.institutionName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.INSTITUTION_UPDATE_PATH}`, '', {params});
  }

  deleteInstitution(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.INSTITUTION_DELETE_PATH}/${id}`);
  }

  onFetchInstitution() {
    this.institutionDispatcher._InstitutionGet()
  }

  onFetchInstitutionQuery(data: any) {
    this.institutionDispatcher._InstitutionGetQuery(data)
  }

  onAddInstitution(data: InstitutionDomain) {
    this.institutionDispatcher._InstitutionAdd(data)
  }

  onUpdateInstitution(currentName: string, data: InstitutionDomain) {
    this.institutionDispatcher._InstitutionUpdate(currentName, data)
  }

  onDeleteInstitution(id: number) {
    this.institutionDispatcher._InstitutionDelete(id)
  }

}
