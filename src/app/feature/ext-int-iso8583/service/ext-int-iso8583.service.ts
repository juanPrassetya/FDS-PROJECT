import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ExtIntIso8583Dispatcher} from "../state/ext-int-iso8583.dispatcher";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {MessageConfigurationDomain} from "../domain/message-configuration.domain";
import {HeaderFieldDomain} from "../domain/header-field.domain";
import {BodyFieldDomain} from "../domain/body-field.domain";
import {ChildBodyFieldDomain} from "../domain/child-body-field.domain";
import {StateContext} from "@ngxs/store";
import {ExtIntIso8583StateModel} from "../state/ext-int-iso8583.state";

@Injectable({
  providedIn: 'root'
})
export class ExtIntISO8583Service {
  private apiUrl = environment.dev_env
  constructor(
    private http: HttpClient,
    private extIntISO8583Dispatcher: ExtIntIso8583Dispatcher
  ) { }

  //Message Configuration
  getMessageConfiguration() {
    return this.http.get<CustomHttpResponse<MessageConfigurationDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_ISO8583_GET_PATH}`)
  }

  getMessageConfigurationQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_ISO8583_GET_QUERY_PATH}`, data)
  }

  getMessageConfigurationById(id: number) {
    return this.http.get<CustomHttpResponse<MessageConfigurationDomain>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_GET_BY_ID_PATH}/${id}`)
  }

  addMessageConfiguration(data: MessageConfigurationDomain) {
    return this.http.post<CustomHttpResponse<MessageConfigurationDomain>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_ADD_PATH}`, data)
  }

  updateMessageConfiguration(data: MessageConfigurationDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_UPDATE_PATH}`, data)
  }

  deleteMessageConfiguration(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_DELETE_PATH}/${id}`)
  }

  onGetMessageConfiguration() {
    this.extIntISO8583Dispatcher._MessageConfigurationGet()
  }

  onGetMessageConfigurationQuery(data: any) {
    this.extIntISO8583Dispatcher._MessageConfigurationGetQuery(data)
  }

  onGetMessageConfigurationById(id: number) {
    this.extIntISO8583Dispatcher._MessageConfigurationGetById(id)
  }

  onAddMessageConfiguration(data: MessageConfigurationDomain) {
    this.extIntISO8583Dispatcher._MessageConfigurationAdd(data)
  }

  onUpdateMessageConfiguration(data: MessageConfigurationDomain) {
    this.extIntISO8583Dispatcher._MessageConfigurationUpdate(data)
  }

  onDeleteMessageConfiguration(id: number) {
    this.extIntISO8583Dispatcher._MessageConfigurationDelete(id)
  }

  //Header Field
  getHeaderField(id: number) {
    return this.http.get<CustomHttpResponse<HeaderFieldDomain[]>>(`${this.apiUrl}/${RoutePathEnum.HEADER_FIELD_GET_PATH}/${id}`)
  }

  getHeaderFieldQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.HEADER_FIELD_GET_QUERY_PATH}`, data)
  }

  addHeaderField(data: HeaderFieldDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.HEADER_FIELD_ADD_PATH}`, data)
  }

  updateHeaderField(data: HeaderFieldDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.HEADER_FIELD_UPDATE_PATH}`, data)
  }

  deleteHeaderField(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.HEADER_FIELD_DELETE_PATH}/${id}`)
  }

  onGetHeaderField(id: number) {
    this.extIntISO8583Dispatcher._HeaderFieldGet(id)
  }

  onGetHeaderFieldQuery(data: any) {
    this.extIntISO8583Dispatcher._HeaderFieldGetQuery(data)
  }

  onAddHeaderField(data: HeaderFieldDomain) {
    this.extIntISO8583Dispatcher._HeaderFieldAdd(data)
  }

  onUpdateHeaderField(data: HeaderFieldDomain) {
    this.extIntISO8583Dispatcher._HeaderFieldUpdate(data)
  }

  onDeleteHeaderField(id: number) {
    this.extIntISO8583Dispatcher._HeaderFieldDelete(id)
  }

  //Body Field
  getBodyField(id: number) {
    return this.http.get<CustomHttpResponse<BodyFieldDomain[]>>(`${this.apiUrl}/${RoutePathEnum.BODY_FIELD_GET_PATH}/${id}`)
  }

  getBodyFieldQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.BODY_FIELD_GET_QUERY_PATH}`, data)
  }

  addBodyField(data: BodyFieldDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BODY_FIELD_ADD_PATH}`, data)
  }

  updateBodyField(data: BodyFieldDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BODY_FIELD_UPDATE_PATH}`, data)
  }

  deleteBodyField(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.BODY_FIELD_DELETE_PATH}/${id}`)
  }

  onGetBodyField(id: number) {
    this.extIntISO8583Dispatcher._BodyFieldGet(id)
  }

  onGetBodyFieldQuery(data: any) {
    this.extIntISO8583Dispatcher._BodyFieldGetQuery(data);
  }

  onAddBodyField(data: BodyFieldDomain) {
    this.extIntISO8583Dispatcher._BodyFieldAdd(data)
  }

  onUpdateBodyField(data: BodyFieldDomain) {
    this.extIntISO8583Dispatcher._BodyFieldUpdate(data)
  }

  onDeleteBodyField(id: number) {
    this.extIntISO8583Dispatcher._BodyFieldDelete(id)
  }

  //Child Body Field
  getChildBodyField(id: number) {
    return this.http.get<CustomHttpResponse<ChildBodyFieldDomain[]>>(`${this.apiUrl}/${RoutePathEnum.CHILD_BODY_FIELD_GET_PATH}/${id}`)
  }

  addChildBodyField(data: ChildBodyFieldDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.CHILD_BODY_FIELD_ADD_PATH}`, data)
  }

  updateChildBodyField(data: ChildBodyFieldDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.CHILD_BODY_FIELD_UPDATE_PATH}`, data)
  }

  deleteChildBodyField(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.CHILD_BODY_FIELD_DELETE_PATH}/${id}`)
  }

  onGetChildBodyField(id: number) {
    this.extIntISO8583Dispatcher._ChildBodyFieldGet(id)
  }

  onAddChildBodyField(data: ChildBodyFieldDomain) {
    this.extIntISO8583Dispatcher._ChildBodyFieldAdd(data)
  }

  onUpdateChildBodyField(data: ChildBodyFieldDomain) {
    this.extIntISO8583Dispatcher._ChildBodyFieldUpdate(data)
  }

  onDeleteChildBodyField(id: number) {
    this.extIntISO8583Dispatcher._ChildBodyFieldDelete(id)
  }

  onGetBodyChildField(configId: number, bodyId: number) {
    this.extIntISO8583Dispatcher._GetBodyChildField(configId, bodyId)
  }

  onGetAllInformation(action: (ctx: StateContext<ExtIntIso8583StateModel>) => void) {
    this.extIntISO8583Dispatcher._GetAllInformation(action)
  }

  onResetAllInformation(action: (ctx: StateContext<ExtIntIso8583StateModel>) => void) {
    this.extIntISO8583Dispatcher._ExtISO8583ResetAllInformation(action)
  }
}
