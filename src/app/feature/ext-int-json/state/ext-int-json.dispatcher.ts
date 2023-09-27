import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {MessageConfigurationDomain} from "../../ext-int-iso8583/domain/message-configuration.domain";
import {
  JSONActionType,
  JSONBodyConfigsAddField,
  JSONBodyConfigsDeleteField,
  JSONBodyConfigsUpdateField,
  JSONBodyFieldGet,
  JSONDataType,
  JSONEndpointAdd,
  JSONEndpointDelete,
  JSONEndpointGet,
  JSONEndpointGetById,
  JSONEndpointUpdate,
  JSONFormatterGet,
  JSONGetAllInformation,
  JSONHeaderConfigDeleteField,
  JSONHeaderConfigsAddField,
  JSONHeaderConfigsUpdateField,
  JSONHeaderFieldGet,
  JSONMessageConfigurationAdd,
  JSONMessageConfigurationDelete,
  JSONMessageConfigurationGet,
  JSONMessageConfigurationGetById,
  JSONMessageConfigurationGetQuery,
  JSONMessageConfigurationUpdate,
  JSONResetAllInformation
} from "./ext-int-json.action";
import {StateContext} from "@ngxs/store";
import {ExtIntJsonStateModel} from "./ext-int-json.state";
import { JsonConfigsHeaderDomain } from "../domain/json-header-field.domain";
import { JsonBodyFieldDomain } from "../domain/json-body-field.domain";
import { JsonEndpointDomain } from "../domain/json-endpoint.domain";

@Injectable({
  providedIn: 'root'
})
export class ExtIntJsonDispatcher {

  //Message Configuration
  @Dispatch()
  public _JSONMessageConfigurationGet() {
    return new JSONMessageConfigurationGet()
  }

  @Dispatch()
  public _JSONMessageConfigurationGetQuery(data: any) {
    return new JSONMessageConfigurationGetQuery(data)
  }

  @Dispatch()
  public _JSONMessageConfigurationGetById(id: number) {
    return new JSONMessageConfigurationGetById(id)
  }

  @Dispatch()
  public _JSONMessageConfigurationAdd(data: MessageConfigurationDomain) {
    return new JSONMessageConfigurationAdd(data)
  }

  @Dispatch()
  public _JSONMessageConfigurationUpdate(data: MessageConfigurationDomain) {
    return new JSONMessageConfigurationUpdate(data)
  }

  @Dispatch()
  public _JSONMessageConfigurationDelete(id: number) {
    return new JSONMessageConfigurationDelete(id)
  }

  // Header Field

  @Dispatch()
  public _JSONHeaderGet(id: number) {
    return new JSONHeaderFieldGet(id);
  }

  @Dispatch()
  public _JSONHeaderConfigsFieldAdd(data: JsonConfigsHeaderDomain) {
    return new JSONHeaderConfigsAddField(data)
  }

  @Dispatch()
  public _JSONHeaderConfigsFieldUpdate(data: JsonConfigsHeaderDomain) {
    return new JSONHeaderConfigsUpdateField(data)
  }

  @Dispatch()
  public _JSONHeaderConfigsFieldDelete(id: number) {
    return new JSONHeaderConfigDeleteField(id);
  }

  // Body Field
  @Dispatch()
  public _JSONBodyGet(id: number) {
    return new JSONBodyFieldGet(id)
  }

  @Dispatch()
  public _JSONBodyConfigFieldAdd(data: JsonBodyFieldDomain) {
    return new JSONBodyConfigsAddField(data)
  }

  @Dispatch()
  public _JSONBodyConfigFieldUpdate(data: JsonBodyFieldDomain) {
    return new JSONBodyConfigsUpdateField(data)
  }

  @Dispatch()
  public _JSONBodyConfigFieldDelete(id: number) {
    return new JSONBodyConfigsDeleteField(id)
  }

  @Dispatch()
  public _JSONFormatter() {
    return new JSONFormatterGet();
  }

  @Dispatch()
  public _JSONDataType() {
    return new JSONDataType();
  }

  @Dispatch()
  public _JSONActionType() {
    return new JSONActionType();
  }

  // Endpoint
  @Dispatch()
  public _JSONEndpointGet(id: number) {
    return new JSONEndpointGet(id)
  }

  @Dispatch()
  public _JSONEndpointGetById(id: number) {
    return new JSONEndpointGetById(id)
  }

  @Dispatch()
  public _JSONEndpointAdd(data: JsonEndpointDomain) {
    return new JSONEndpointAdd(data)
  }

  @Dispatch()
  public _JSONEndpointUpdate(data: JsonEndpointDomain) {
    return new JSONEndpointUpdate(data)
  }

  @Dispatch()
  public _JSONEndpointDelete(id: number) {
    return new JSONEndpointDelete(id)
  }

  @Dispatch()
  public _JSONGetAllInformation(action: (ctx: StateContext<ExtIntJsonStateModel>) => void) {
    return new JSONGetAllInformation(action)
  }

  @Dispatch()
  public _JSONResetAllInformation(action: (ctx: StateContext<ExtIntJsonStateModel>) => void) {
    return new JSONResetAllInformation(action)
  }
}
