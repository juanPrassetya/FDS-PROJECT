import {MessageConfigurationDomain} from "../domain/message-configuration.domain";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {ExtIntISO8583Service} from "../service/ext-int-iso8583.service";
import {lastValueFrom, tap} from "rxjs";
import {
  BodyFieldAdd,
  BodyFieldDelete,
  BodyFieldGet,
  BodyFieldGetQuery,
  BodyFieldUpdate,
  ChildBodyFieldAdd,
  ChildBodyFieldDelete,
  ChildBodyFieldGet,
  ChildBodyFieldUpdate, ExtISO8583ResetAllInformation,
  GetAllInformation, GetBodyChildField,
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
  MessageConfigurationUpdate,
  getIntRespCode,
  getIntTransactionType
} from "./ext-int-iso8583.actions";
import {HeaderFieldDomain} from "../domain/header-field.domain";
import {BodyFieldDomain} from "../domain/body-field.domain";
import {ChildBodyFieldDomain} from "../domain/child-body-field.domain";
import { ResponseCodeService } from "../../response-code/service/response-code.service";
import { IntResponseCodeDomain } from "../../response-code/domain/int-response-code.domain";
import { TransactionTypeService } from "../../transaction-type/service/transaction-type.service";
import { IntTransactionTypeDomain } from "../../transaction-type/domain/int-transaction-type.domain";

export class ExtIntIso8583StateModel {
  messageConfigurations: MessageConfigurationDomain[] = [];
  messageConfiguration: MessageConfigurationDomain | undefined;
  intRespCode: IntResponseCodeDomain[] = [];
  headerFields: HeaderFieldDomain[] = []
  bodyFields: BodyFieldDomain[] = []
  childBodyFields: ChildBodyFieldDomain[] = []
  intTransType: IntTransactionTypeDomain[] = [];
}

@State<ExtIntIso8583StateModel>({
  name: 'extIntISO8583State',
  defaults: {
    messageConfigurations: [],
    messageConfiguration: undefined,
    headerFields: [],
    bodyFields: [],
    childBodyFields: [],
    intRespCode: [],
    intTransType: []
  }
})

@Injectable()
export class ExtIntISO8583State {
  constructor(
    private extIntISO8583Service: ExtIntISO8583Service,
    private notificationService: NotificationService,
    private responseCodeService: ResponseCodeService,
    private transTypeService: TransactionTypeService
  ) {
  }

  @Selector()
  static messageConfigurations(state: ExtIntIso8583StateModel) {
    return state.messageConfigurations
  }

  @Selector()
  static messageConfiguration(state: ExtIntIso8583StateModel) {
    return state.messageConfiguration
  }

  @Selector()
  static headerFields(state: ExtIntIso8583StateModel) {
    return state.headerFields
  }

  @Selector()
  static bodyFields(state: ExtIntIso8583StateModel) {
    return state.bodyFields
  }

  @Selector()
  static childBodyFields(state: ExtIntIso8583StateModel) {
    return state.childBodyFields
  }

  @Selector()
  static intResponseCode(state: ExtIntIso8583StateModel) {
    return state.intRespCode
  }

  @Selector()
  static intTransactionType(state: ExtIntIso8583StateModel) {
    return state.intTransType
  }

  @Action(MessageConfigurationGet, {cancelUncompleted: true})
  getMsgConfig(ctx: StateContext<ExtIntIso8583StateModel>) {
    return this.extIntISO8583Service.getMessageConfiguration().pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            messageConfigurations: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(MessageConfigurationGetQuery, {cancelUncompleted: true})
  getMsgConfigByQuery(ctx: StateContext<ExtIntIso8583StateModel>, {data}: MessageConfigurationGetQuery) {
    return this.extIntISO8583Service.getMessageConfigurationQuery(data).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            messageConfigurations: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(MessageConfigurationGetById, {cancelUncompleted: true})
  getMsgConfigById(ctx: StateContext<ExtIntIso8583StateModel>, {id}: MessageConfigurationGetById) {
    return this.extIntISO8583Service.getMessageConfigurationById(id).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            messageConfiguration: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(MessageConfigurationAdd, {cancelUncompleted: true})
  addMsgConfig(ctx: StateContext<ExtIntIso8583StateModel>, {data}: MessageConfigurationAdd) {
    return this.extIntISO8583Service.addMessageConfiguration(data).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            messageConfiguration: response.responseData
          })
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(MessageConfigurationUpdate, {cancelUncompleted: true})
  updateMsgConfig(ctx: StateContext<ExtIntIso8583StateModel>, {data}: MessageConfigurationUpdate) {
    return this.extIntISO8583Service.updateMessageConfiguration(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(MessageConfigurationDelete, {cancelUncompleted: true})
  deleteMsgConfig(ctx: StateContext<ExtIntIso8583StateModel>, {id}: MessageConfigurationDelete) {
    return this.extIntISO8583Service.deleteMessageConfiguration(id).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(HeaderFieldGet, {cancelUncompleted: true})
  getHeaderField(ctx: StateContext<ExtIntIso8583StateModel>, {id}: HeaderFieldGet) {
    return this.extIntISO8583Service.getHeaderField(id).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            headerFields: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(HeaderFieldGetQuery, {cancelUncompleted: true})
  getHeaderFieldQuery(ctx: StateContext<ExtIntIso8583StateModel>, {data}: HeaderFieldGetQuery) {
    return this.extIntISO8583Service.getHeaderFieldQuery(data).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            headerFields: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(HeaderFieldAdd, {cancelUncompleted: true})
  addHeaderField(ctx: StateContext<ExtIntIso8583StateModel>, {data}: HeaderFieldAdd) {
    return this.extIntISO8583Service.addHeaderField(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(HeaderFieldUpdate, {cancelUncompleted: true})
  updateHeaderField(ctx: StateContext<ExtIntIso8583StateModel>, {data}: HeaderFieldUpdate) {
    return this.extIntISO8583Service.updateHeaderField(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(HeaderFieldDelete, {cancelUncompleted: true})
  deleteHeaderField(ctx: StateContext<ExtIntIso8583StateModel>, {id}: HeaderFieldDelete) {
    return this.extIntISO8583Service.deleteHeaderField(id).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(BodyFieldGet, {cancelUncompleted: true})
  getBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {id}: BodyFieldGet) {
    return this.extIntISO8583Service.getBodyField(id).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            bodyFields: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(BodyFieldGetQuery, {cancelUncompleted: true})
  getBodyFieldQuery(ctx: StateContext<ExtIntIso8583StateModel>, {data}: BodyFieldGetQuery) {
    return this.extIntISO8583Service.getBodyFieldQuery(data).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            bodyFields: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(BodyFieldAdd, {cancelUncompleted: true})
  addBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {data}: BodyFieldAdd) {
    return this.extIntISO8583Service.addBodyField(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(BodyFieldUpdate, {cancelUncompleted: true})
  updateBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {data}: BodyFieldUpdate) {
    return this.extIntISO8583Service.updateBodyField(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(BodyFieldDelete, {cancelUncompleted: true})
  deleteBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {id}: BodyFieldDelete) {
    return this.extIntISO8583Service.deleteBodyField(id).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ChildBodyFieldGet, {cancelUncompleted: true})
  getChildBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {id}: ChildBodyFieldGet) {
    return this.extIntISO8583Service.getChildBodyField(id).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            childBodyFields: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ChildBodyFieldAdd, {cancelUncompleted: true})
  addChildBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {data}: ChildBodyFieldAdd) {
    return this.extIntISO8583Service.addChildBodyField(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ChildBodyFieldUpdate, {cancelUncompleted: true})
  updateChildBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {data}: ChildBodyFieldUpdate) {
    return this.extIntISO8583Service.updateChildBodyField(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ChildBodyFieldDelete, {cancelUncompleted: true})
  deleteChildBodyField(ctx: StateContext<ExtIntIso8583StateModel>, {id}: ChildBodyFieldDelete) {
    return this.extIntISO8583Service.deleteChildBodyField(id).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  // RespCode

  @Action(getIntRespCode, {cancelUncompleted: true})
  getIntRespCode(ctx: StateContext<ExtIntIso8583StateModel>) {
    return this.responseCodeService.getIntRespCode().pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            intRespCode: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  // Transaction Type
  @Action(getIntTransactionType, {cancelUncompleted: true})
  getIntTransactionType(ctx: StateContext<ExtIntIso8583StateModel>) {
    return this.transTypeService.getIntTransactionType().pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            intTransType: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(GetBodyChildField, {cancelUncompleted: true})
  async getBodyChildField(ctx: StateContext<ExtIntIso8583StateModel>, {configId, bodyId}: GetBodyChildField) {
    await lastValueFrom(ctx.dispatch(new BodyFieldGet(configId)))
    await lastValueFrom(ctx.dispatch(new ChildBodyFieldGet(bodyId)))
  }

  @Action(GetAllInformation, {cancelUncompleted: true})
  getAllInformation(ctx: StateContext<ExtIntIso8583StateModel>, {action}: GetAllInformation) {
    action(ctx)
    // await lastValueFrom(ctx.dispatch(new MessageConfigurationGetById(id)))
    // await lastValueFrom(ctx.dispatch(new HeaderFieldGet(id)))
    // await lastValueFrom(ctx.dispatch(new BodyFieldGet(id)))
  }

  @Action(ExtISO8583ResetAllInformation, {cancelUncompleted: true})
  resetAllInformation(ctx: StateContext<ExtIntIso8583StateModel>, {action}: ExtISO8583ResetAllInformation) {
    action(ctx)
    // ctx.setState({
    //   ...ctx.getState(),
    //   messageConfiguration: undefined,
    //   headerFields: [],
    //   bodyFields: [],
    //   childBodyFields: []
    // })
  }
}
