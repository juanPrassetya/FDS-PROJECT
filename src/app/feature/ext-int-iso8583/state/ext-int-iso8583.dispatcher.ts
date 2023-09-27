import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  BodyFieldAdd,
  BodyFieldDelete,
  BodyFieldGet,
  BodyFieldGetQuery,
  BodyFieldUpdate,
  ChildBodyFieldAdd,
  ChildBodyFieldDelete,
  ChildBodyFieldGet,
  ChildBodyFieldUpdate,
  ExtISO8583ResetAllInformation,
  GetAllInformation,
  GetBodyChildField,
  HeaderFieldAdd,
  HeaderFieldDelete,
  HeaderFieldGet,
  HeaderFieldGetQuery,
  HeaderFieldUpdate,
  MessageConfigurationAdd,
  MessageConfigurationDelete,
  MessageConfigurationGet,
  MessageConfigurationGetById,
  MessageConfigurationGetQuery,
  MessageConfigurationUpdate
} from "./ext-int-iso8583.actions";
import {MessageConfigurationDomain} from "../domain/message-configuration.domain";
import {HeaderFieldDomain} from "../domain/header-field.domain";
import {BodyFieldDomain} from "../domain/body-field.domain";
import {ChildBodyFieldDomain} from "../domain/child-body-field.domain";
import {StateContext} from "@ngxs/store";
import {ExtIntIso8583StateModel} from "./ext-int-iso8583.state";

@Injectable({
  providedIn: 'root'
})
export class ExtIntIso8583Dispatcher {

  //Message Configuration
  @Dispatch()
  public _MessageConfigurationGet() {
    return new MessageConfigurationGet()
  }

  @Dispatch()
  public _MessageConfigurationGetQuery(data: any) {
    return new MessageConfigurationGetQuery(data)
  }

  @Dispatch()
  public _MessageConfigurationGetById(id: number) {
    return new MessageConfigurationGetById(id)
  }

  @Dispatch()
  public _MessageConfigurationAdd(data: MessageConfigurationDomain) {
    return new MessageConfigurationAdd(data)
  }

  @Dispatch()
  public _MessageConfigurationUpdate(data: MessageConfigurationDomain) {
    return new MessageConfigurationUpdate(data)
  }

  @Dispatch()
  public _MessageConfigurationDelete(id: number) {
    return new MessageConfigurationDelete(id)
  }

  //Header Field
  @Dispatch()
  public _HeaderFieldGet(id: number) {
    return new HeaderFieldGet(id)
  }

  @Dispatch()
  public _HeaderFieldGetQuery(data: any) {
    return new HeaderFieldGetQuery(data)
  }

  @Dispatch()
  public _HeaderFieldAdd(data: HeaderFieldDomain) {
    return new HeaderFieldAdd(data)
  }

  @Dispatch()
  public _HeaderFieldUpdate(data: HeaderFieldDomain) {
    return new HeaderFieldUpdate(data)
  }

  @Dispatch()
  public _HeaderFieldDelete(id: number) {
    return new HeaderFieldDelete(id)
  }

  //Body Field
  @Dispatch()
  public _BodyFieldGet(id: number) {
    return new BodyFieldGet(id)
  }

  @Dispatch()
  public _BodyFieldGetQuery(data: any) {
    return new BodyFieldGetQuery(data)
  }

  @Dispatch()
  public _BodyFieldAdd(data: BodyFieldDomain) {
    return new BodyFieldAdd(data)
  }

  @Dispatch()
  public _BodyFieldUpdate(data: BodyFieldDomain) {
    return new BodyFieldUpdate(data)
  }

  @Dispatch()
  public _BodyFieldDelete(id: number) {
    return new BodyFieldDelete(id)
  }

  //Child Body Field
  @Dispatch()
  public _ChildBodyFieldGet(id: number) {
    return new ChildBodyFieldGet(id)
  }

  @Dispatch()
  public _ChildBodyFieldAdd(data: ChildBodyFieldDomain) {
    return new ChildBodyFieldAdd(data)
  }

  @Dispatch()
  public _ChildBodyFieldUpdate(data: ChildBodyFieldDomain) {
    return new ChildBodyFieldUpdate(data)
  }

  @Dispatch()
  public _ChildBodyFieldDelete(id: number) {
    return new ChildBodyFieldDelete(id)
  }

  @Dispatch()
  public _GetBodyChildField(configId: number, bodyId: number) {
    return new GetBodyChildField(configId, bodyId)
  }

  @Dispatch()
  public _GetAllInformation(action: (ctx: StateContext<ExtIntIso8583StateModel>) => void) {
    return new GetAllInformation(action)
  }

  @Dispatch()
  public _ExtISO8583ResetAllInformation(action: (ctx: StateContext<ExtIntIso8583StateModel>) => void) {
    return new ExtISO8583ResetAllInformation(action)
  }
}
