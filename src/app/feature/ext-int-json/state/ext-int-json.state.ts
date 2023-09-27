import { MessageConfigurationDomain } from '../../ext-int-iso8583/domain/message-configuration.domain';
import { IntResponseCodeDomain } from '../../response-code/domain/int-response-code.domain';
import { HeaderFieldDomain } from '../../ext-int-iso8583/domain/header-field.domain';
import { BodyFieldDomain } from '../../ext-int-iso8583/domain/body-field.domain';
import { IntTransactionTypeDomain } from '../../transaction-type/domain/int-transaction-type.domain';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ExtIntJSONService } from '../service/ext-int-json.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { tap } from 'rxjs';
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
  JSONResetAllInformation,
  getIntRespCode,
  getIntTransactionType,
} from './ext-int-json.action';
import { ResponseCodeService } from '../../response-code/service/response-code.service';
import { TransactionTypeService } from '../../transaction-type/service/transaction-type.service';
import { JsonHeaderFieldDomain } from '../domain/json-header-field.domain';
import { JsonFormatterDomain } from '../domain/json-formatter.domain';
import { JsonFieldTypeDomain } from '../domain/json-field-type.domain';
import { JsonEndpointFieldDomain } from '../domain/json-body-field.domain';
import { JsonActionTypeDomain } from '../domain/json-action-type.domain';
import { JsonEndpointDomain } from '../domain/json-endpoint.domain';

export class ExtIntJsonStateModel {
  messageConfigurations: MessageConfigurationDomain[] = [];
  messageConfiguration: MessageConfigurationDomain | undefined;
  intRespCode: IntResponseCodeDomain[] = [];
  headerFields: JsonHeaderFieldDomain[] = [];
  bodyFields: JsonEndpointFieldDomain[] = [];
  intTransType: IntTransactionTypeDomain[] = [];
  endpoints: JsonEndpointDomain[] = [];
  endpoint: JsonEndpointDomain | undefined;
  formatters: JsonFormatterDomain[] = [];
  dataTypes: JsonFieldTypeDomain[] = [];
  actionTypes: JsonActionTypeDomain[] = [];
}

@State<ExtIntJsonStateModel>({
  name: 'extIntJSONState',
  defaults: {
    messageConfigurations: [],
    messageConfiguration: undefined,
    headerFields: [],
    bodyFields: [],
    intRespCode: [],
    intTransType: [],
    endpoints: [],
    formatters: [],
    dataTypes: [],
    actionTypes: [],
    endpoint: undefined
  },
})
@Injectable()
export class ExtIntJSONState {
  constructor(
    private extIntJSONService: ExtIntJSONService,
    private notificationService: NotificationService,
    private respCodeService: ResponseCodeService,
    private transTypeService: TransactionTypeService
  ) {}

  @Selector()
  static messageConfigurations(state: ExtIntJsonStateModel) {
    return state.messageConfigurations;
  }

  @Selector()
  static messageConfiguration(state: ExtIntJsonStateModel) {
    return state.messageConfiguration;
  }

  @Selector()
  static headerFields(state: ExtIntJsonStateModel) {
    return state.headerFields;
  }

  @Selector()
  static bodyFields(state: ExtIntJsonStateModel) {
    return state.bodyFields;
  }

  @Selector()
  static endpoints(state: ExtIntJsonStateModel) {
    return state.endpoints;
  }

  @Selector()
  static endpoint(state: ExtIntJsonStateModel) {
    return state.endpoint;
  }

  @Selector()
  static intResponseCode(state: ExtIntJsonStateModel) {
    return state.intRespCode;
  }

  @Selector()
  static intTransactionType(state: ExtIntJsonStateModel) {
    return state.intTransType;
  }

  @Selector()
  static formatters(state: ExtIntJsonStateModel) {
    return state.formatters;
  }

  @Selector()
  static dataTypes(state: ExtIntJsonStateModel) {
    return state.dataTypes;
  }

  @Selector()
  static actionTypes(stat: ExtIntJsonStateModel) {
    return stat.actionTypes;
  }

  @Action(JSONMessageConfigurationGet, { cancelUncompleted: true })
  getMsgConfig(ctx: StateContext<ExtIntJsonStateModel>) {
    return this.extIntJSONService.getMessageConfiguration().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            messageConfigurations: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONMessageConfigurationGetQuery, { cancelUncompleted: true })
  getMsgConfigByQuery(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONMessageConfigurationGetQuery
  ) {
    return this.extIntJSONService.getMessageConfigurationQuery(data).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            messageConfigurations: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONMessageConfigurationGetById, { cancelUncompleted: true })
  getMsgConfigById(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONMessageConfigurationGetById
  ) {
    return this.extIntJSONService.getMessageConfigurationById(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            messageConfiguration: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONMessageConfigurationAdd, { cancelUncompleted: true })
  addMsgConfig(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONMessageConfigurationAdd
  ) {
    return this.extIntJSONService.addMessageConfiguration(data).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            messageConfiguration: response.responseData,
          });
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONMessageConfigurationUpdate, { cancelUncompleted: true })
  updateMsgConfig(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONMessageConfigurationUpdate
  ) {
    return this.extIntJSONService.updateMessageConfiguration(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONMessageConfigurationDelete, { cancelUncompleted: true })
  deleteMsgConfig(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONMessageConfigurationDelete
  ) {
    return this.extIntJSONService.deleteMessageConfiguration(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  // Header Field

  @Action(JSONHeaderFieldGet, { cancelUncompleted: true })
  getHeaderField(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONHeaderFieldGet
  ) {
    return this.extIntJSONService.getHeaderField(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            headerFields: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONHeaderConfigsAddField, { cancelUncompleted: true })
  addData(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONHeaderConfigsAddField
  ) {
    return this.extIntJSONService.addFieldHeader(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONHeaderConfigsUpdateField, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONHeaderConfigsUpdateField
  ) {
    return this.extIntJSONService.updateFieldHeader(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONHeaderConfigDeleteField, { cancelUncompleted: true })
  deleteData(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONHeaderConfigDeleteField
  ) {
    return this.extIntJSONService.deleteFieldHeader(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  // Body Field
  @Action(JSONBodyFieldGet, { cancelUncompleted: true })
  getBodyField(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONBodyFieldGet
  ) {
    return this.extIntJSONService.getBodyField(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            bodyFields: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONBodyConfigsAddField, { cancelUncompleted: true })
  addDataBodyField(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONBodyConfigsAddField
  ) {
    return this.extIntJSONService.addFieldBody(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONBodyConfigsUpdateField, { cancelUncompleted: true })
  updateDataBodyField(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONBodyConfigsUpdateField
  ) {
    return this.extIntJSONService.updateFieldBody(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONBodyConfigsDeleteField, { cancelUncompleted: true })
  deleteDataBodyField(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONBodyConfigsDeleteField
  ) {
    return this.extIntJSONService.deleteFieldBody(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONFormatterGet, { cancelUncompleted: true })
  getFormatter(ctx: StateContext<ExtIntJsonStateModel>) {
    return this.extIntJSONService.getFormatter().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            formatters: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONDataType, { cancelUncompleted: true })
  getDataTypes(ctx: StateContext<ExtIntJsonStateModel>) {
    return this.extIntJSONService.getDataType().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            dataTypes: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONActionType, { cancelUncompleted: true }) getActionTypes(
    ctx: StateContext<ExtIntJsonStateModel>
  ) {
    return this.extIntJSONService.getActionType().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            actionTypes: response.responseData,
          });
        },
        (error) => {
          if (error.stat != 401) {
            this.notificationService.errorHttpNotification(error);
          }
        }
      )
    );
  }

  // Endpoint

  @Action(JSONEndpointGet, { cancelUncompleted: true })
  getEndpoint(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONEndpointGet
  ) {
    return this.extIntJSONService.getEndpoint(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            endpoints: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONEndpointGetById, { cancelUncompleted: true })
  getEndpointById(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONEndpointGetById
  ) {
    return this.extIntJSONService.getEndpointById(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            endpoint: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONEndpointAdd, { cancelUncompleted: true }) addEndpoint(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONEndpointAdd
  ) {
    return this.extIntJSONService.addEndpoint(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONEndpointUpdate, { cancelUncompleted: true }) updateEndpoint(
    ctx: StateContext<ExtIntJsonStateModel>,
    { data }: JSONEndpointUpdate
  ) {
    return this.extIntJSONService.updateEndpoint(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONEndpointDelete, { cancelUncompleted: true }) deleteEndpoint(
    ctx: StateContext<ExtIntJsonStateModel>,
    { id }: JSONEndpointDelete
  ) {
    return this.extIntJSONService.deleteEndpoint(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  // RespCode

  @Action(getIntRespCode, { cancelUncompleted: true })
  getIntRespCode(ctx: StateContext<ExtIntJsonStateModel>) {
    return this.respCodeService.getIntRespCode().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            intRespCode: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  // Transaction Type
  @Action(getIntTransactionType, { cancelUncompleted: true })
  getIntTransactionType(ctx: StateContext<ExtIntJsonStateModel>) {
    return this.transTypeService.getIntTransactionType().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            intTransType: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(JSONGetAllInformation, { cancelUncompleted: true })
  getAllInformation(
    ctx: StateContext<ExtIntJsonStateModel>,
    { action }: JSONGetAllInformation
  ) {
    action(ctx);
  }

  @Action(JSONResetAllInformation, { cancelUncompleted: true })
  resetAllInformation(
    ctx: StateContext<ExtIntJsonStateModel>,
    { action }: JSONResetAllInformation
  ) {
    action(ctx);
  }
}
