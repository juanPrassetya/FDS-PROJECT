import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {MessageConfigurationDomain} from "../../ext-int-iso8583/domain/message-configuration.domain";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {ExtIntJsonDispatcher} from "../state/ext-int-json.dispatcher";
import {StateContext} from "@ngxs/store";
import {ExtIntJsonStateModel} from "../state/ext-int-json.state";
import { HeaderFieldDomain } from "../../ext-int-iso8583/domain/header-field.domain";
import { JsonConfigsHeaderDomain, JsonHeaderFieldDomain } from "../domain/json-header-field.domain";
import { JsonFormatterDomain } from "../domain/json-formatter.domain";
import { JsonFieldTypeDomain } from "../domain/json-field-type.domain";
import { JsonEndpointFieldDomain, JsonBodyFieldDomain } from "../domain/json-body-field.domain";
import { JsonActionTypeDomain } from "../domain/json-action-type.domain";
import { JsonEndpointDomain } from "../domain/json-endpoint.domain";

@Injectable({
  providedIn: 'root'
})
export class ExtIntJSONService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private extIntJsonDispatcher: ExtIntJsonDispatcher
  ) { }

  getMessageConfiguration() {
    return this.http.get<CustomHttpResponse<MessageConfigurationDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_JSON_GET_PATH}`)
  }

  getMessageConfigurationQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.MSG_CONFIGURATION_JSON_GET_QUERY_PATH}`, data)
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

  // Endpoint URL
  getEndpoint(id: number) {
    return this.http.get<CustomHttpResponse<JsonEndpointDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ENDPOINT_GET_PATH}/${id}`)
  }

  getEndpointById(id: number) {
    return this.http.get<CustomHttpResponse<JsonEndpointDomain>>(`${this.apiUrl}/${RoutePathEnum.ENDPOINT_GET_BY_ID_PATH}/${id}`)
  }

  addEndpoint(data: JsonEndpointDomain) {
    return this.http.post<CustomHttpResponse<JsonEndpointDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ENDPOINT_ADD_PATH}`, data)
  }

  updateEndpoint(data: JsonEndpointDomain) {
    return this.http.post<CustomHttpResponse<JsonEndpointDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ENDPOINT_UPDATE_PATH}`, data)
  }

  deleteEndpoint(id: number) {
    return this.http.delete<CustomHttpResponse<JsonEndpointDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ENDPOINT_DELETE_PATH}/${id}`)
  }

  // Header Field
  getHeaderField(id: number) {
    return this.http.get<CustomHttpResponse<JsonHeaderFieldDomain[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_HEADER_FIELD_GET_PATH}/${id}`)
  }

  addFieldHeader(data: JsonConfigsHeaderDomain) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_FIELD_ADD_PATH}`, data)
  }

  updateFieldHeader(data: JsonConfigsHeaderDomain) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_FIELD_UPDATE_PATH}`, data)
  }

  deleteFieldHeader(id: number) {
    return this.http.delete<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_FIELD_DELETE_PATH}/${id}`)
  }

  // Body Field

  getBodyField(id: number) {
    return this.http.get<CustomHttpResponse<JsonEndpointFieldDomain[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_BODY_FIELD_GET_PATH}/${id}`)
  }

  addFieldBody(data: JsonBodyFieldDomain) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_BODY_ADD_PATH}`, data)
  }

  updateFieldBody(data: JsonBodyFieldDomain) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_BODY_UPDATE_PATH}`, data)
  }

  deleteFieldBody(id: number) {
    return this.http.delete<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.JSON_BODY_DELETE_PATH}/${id}`)
  }

  getFormatter() {
    return this.http.get<CustomHttpResponse<JsonFormatterDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FORMATTER_GET_PATH}`)
  }

  getDataType() {
    return this.http.get<CustomHttpResponse<JsonFieldTypeDomain[]>>(`${this.apiUrl}/${RoutePathEnum.DATA_TYPE_GET_PATH}`)
  }

  getActionType() {
    return this.http.get<CustomHttpResponse<JsonActionTypeDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ACTION_TYPE_GET_PATH}`)
  }

  onGetMessageConfiguration() {
    this.extIntJsonDispatcher._JSONMessageConfigurationGet()
  }

  onGetMessageConfigurationQuery(data: any) {
    this.extIntJsonDispatcher._JSONMessageConfigurationGetQuery(data)
  }

  onGetMessageConfigurationById(id: number) {
    this.extIntJsonDispatcher._JSONMessageConfigurationGetById(id)
  }

  onAddMessageConfiguration(data: MessageConfigurationDomain) {
    this.extIntJsonDispatcher._JSONMessageConfigurationAdd(data)
  }

  onUpdateMessageConfiguration(data: MessageConfigurationDomain) {
    this.extIntJsonDispatcher._JSONMessageConfigurationUpdate(data)
  }

  onDeleteMessageConfiguration(id: number) {
    this.extIntJsonDispatcher._JSONMessageConfigurationDelete(id)
  }

  onGetHeaderField(id: number) {
    this.extIntJsonDispatcher._JSONHeaderGet(id)
  }

  onAddHeaderConfigsField(data: JsonConfigsHeaderDomain) {
    this.extIntJsonDispatcher._JSONHeaderConfigsFieldAdd(data)
  }

  onUpdateHeaderConfigsField(data: JsonConfigsHeaderDomain) {
    this.extIntJsonDispatcher._JSONHeaderConfigsFieldUpdate(data)
  }

  onDeleteHeaderConfigsField(id: number) {
    this.extIntJsonDispatcher._JSONHeaderConfigsFieldDelete(id)
  }

  onGetBodyField(id: number) {
    this.extIntJsonDispatcher._JSONBodyGet(id)
  }

  onAddBodyConfigField(data: JsonBodyFieldDomain) {
    this.extIntJsonDispatcher._JSONBodyConfigFieldAdd(data);
  }

  onUpdateBodyConfigField(data: JsonBodyFieldDomain) {
    this.extIntJsonDispatcher._JSONBodyConfigFieldUpdate(data)
  }

  onDeleteBodyConfigField(id: number) {
    this.extIntJsonDispatcher._JSONBodyConfigFieldDelete(id)
  }

  onGetFormatter() {
    this.extIntJsonDispatcher._JSONFormatter();
  }

  onGetDataType() {
    this.extIntJsonDispatcher._JSONDataType();
  }

  onGetActionType() {
    this.extIntJsonDispatcher._JSONActionType();
  }

  onGetEndpoint(id: number) {
    this.extIntJsonDispatcher._JSONEndpointGet(id)
  }

  onAddEndpoint(data: JsonEndpointDomain) {
    this.extIntJsonDispatcher._JSONEndpointAdd(data)
  }

  onUpdateEndpoint(data: JsonEndpointDomain) {
    this.extIntJsonDispatcher._JSONEndpointUpdate(data)
  }

  onDeleteEndpoint(id: number) {
    this.extIntJsonDispatcher._JSONEndpointDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<ExtIntJsonStateModel>) => void) {
    this.extIntJsonDispatcher._JSONGetAllInformation(action)
  }

  onResetAllInformation(action: (ctx: StateContext<ExtIntJsonStateModel>) => void) {
    this.extIntJsonDispatcher._JSONResetAllInformation(action)
  }
}
