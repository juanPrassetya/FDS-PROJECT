import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DefaultComponent} from "./shared/component/default/default.component";
import {TransactionComponent} from "./feature/transaction/transaction.component";
import {RuleComponent} from "./feature/rule/rule.component";
import {RulecrudComponent} from "./feature/rule/component/rulecrud/rulecrud.component";
import {LoginComponent} from "./feature/login/login.component";
import {DashboardComponent} from "./feature/dashboard/dashboard.component";
import {ResetPasswordComponent} from "./feature/reset-password/reset-password.component";
import {AuthGuard} from "./shared/auth/auth.guard";
import {FraudListComponent} from "./feature/fraud-list/fraud-list.component";
import {WhiteListComponent} from "./feature/white-list/white-list.component";
import {BlackListComponent} from "./feature/black-list/black-list.component";
import {AlertInvestigationComponent} from "./feature/alert-investigation/alert-investigation.component";
import {FraudReactionsComponent} from "./feature/fraud-reactions/fraud-reactions.component";
import {RuleGroupComponent} from "./feature/rule-group/rule-group.component";
import {UserComponent} from "./feature/user/user.component";
import {InstitutionComponent} from "./feature/institution/institution.component";
import {ExtIntISO8583Component} from "./feature/ext-int-iso8583/ext-int-iso8583.component";
import {Iso8583DetailsComponent} from "./feature/ext-int-iso8583/component/iso8583-details/iso8583-details.component";
import {NotifTemplateComponent} from './feature/notification-template/notif-template.component';
import {RecipientSetupComponent} from "./feature/recipient-setup/recipient-setup.component";
import {RecipientGroupComponent} from "./feature/recipient-group/recipient-group.component";
import {UserGroupComponent} from "./feature/user-group/user-group.component";
import {UserAuditComponent} from "./feature/user-audit/user-audit.component";
import {UserRoleComponent} from "./feature/user-role/user-role.component";
import {UnauthorizedScreenComponent} from './shared/component/unauthorized-screen/unauthorized-screen.component';
import {ReportComponent} from "./feature/report/report.component";
import {ExtIntJsonComponent} from "./feature/ext-int-json/ext-int-json.component";
import {JsonDetailsComponent} from "./feature/ext-int-json/component/json-details/json-details.component";
import { TransactionTestComponent } from './feature/test/transaction-test.component';
import { PanComponent } from './feature/pan/pan.component';
import { MerchantComponent } from './feature/merchant/merchant.component';
import { KeysComponent } from './feature/keys/keys.component';

const routes: Routes = [
  {
    path: 'home',
    component: DefaultComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: {
          operations: 'VIEW_DASHBOARD'
        }
      },
      {
        path: 'transaction-test',
        component: TransactionTestComponent,
        canActivate: [AuthGuard],
        data: {
          operations: ''
        }
      },
      {
        path: 'transaction',
        component: TransactionComponent,
        canActivate: [AuthGuard],
        data: {
          operations: 'VIEW_TRANSACTION'
        }
      },
      
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AuthGuard],
        data: {
          operations: 'VIEW_REPORT'
        }
      },

      {
        path: 'fraud-management',
        children: [
         
          {
            path: 'alert-investigation',
            component: AlertInvestigationComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_ALERT'
            }
          },
          {
            path: 'rule',
            children: [
              {
                path: '',
                component: RuleComponent,
                canActivate: [AuthGuard],
                data: {
                  operations: 'VIEW_RULE'
                }
              },
              {
                path: 'Add-rule',
                component: RulecrudComponent,
                canActivate: [AuthGuard],
                data: {
                  operations: 'ADD_RULE'
                }
              },
              {
                path: 'edit/:id',
                component: RulecrudComponent,
                canActivate: [AuthGuard],
                data: {
                  operations: 'ADD_RULE'
                }
              }
            ]
          },
          {
            path: 'fraud-reactions',
            component: FraudReactionsComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_REACTIONS'
            }
          },
          {
            path: 'fraud-list',
            component: FraudListComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_FRAUD_LIST'
            }
          },
          {
            path: 'white-list',
            component: WhiteListComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_WHITE_LIST'
            }
          },
          {
            path: 'black-list',
            component: BlackListComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_BLACK_LIST'
            }
          },
          {
            path: 'rule-group',
            component: RuleGroupComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_RULE_GROUP'
            }
          }
        ]
      },
      {
        path: 'notification-template',
        children: [
          {
            path: 'template-setup',
            component: NotifTemplateComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_NOTIF_TEMP'
            }
          },
          {
            path: 'recipient-setup',
            component: RecipientSetupComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_RECIPIENT_SETUP'
            }
          },
          {
            path: 'recipient-group',
            component: RecipientGroupComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_RECIPIENT_GROUP'
            }
          }
        ]
      },
      {
        path: 'user-management',
        children: [
          {
            path: 'user',
            component: UserComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_USER'
            }
          },
          {
            path: 'role',
            component: UserRoleComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_ROLE'
            }
          },
          
          {
            path: 'audit',
            component: UserAuditComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_USER_AUDIT'
            }
          },
          {
            path: 'group',
            component: UserGroupComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_USER_GROUP'
            }
          },
        ]
      },
      // {
      //   path: 'system-parameters',
      //   children: [
      //     {
      //       path: 'response-code',
      //       component: ResponseCodeComponent,
      //       canActivate: [AuthGuard],
      //       data: {
      //         operations: 'VIEW_RULE_GROUP'
      //       }
      //     },
      //     {
      //       path: 'transaction-type',
      //       component: TransactionTypeComponent,
      //       canActivate: [AuthGuard],
      //       data: {
      //         operations: 'VIEW_RULE_GROUP'
      //       }
      //     },
      //     {
      //       path: 'transaction-parameter',
      //       component: TransParamComponent,
      //       canActivate: [AuthGuard],
      //       data: {
      //         operations: 'VIEW_ALERT'
      //       }
      //     },
      //     {
      //       path: 'aid-parameter',
      //       component: AidParameterComponent,
      //       canActivate: [AuthGuard],
      //       data: {
      //         operations: 'VIEW_ALERT'
      //       }
      //     }
      //   ]
      // },
      {
        path: 'ext-interfaces',
        children: [
          {
            path: 'ISO8583',//tadinya ISO8583 (ext-int-iso8583) diganti jadi Terminal
            children: [
              {
                path: '',
                component: ExtIntISO8583Component,
                canActivate: [AuthGuard],
                data: {
                  operations: 'VIEW_EXT_ISO8583'
                },
              },
              {
                path: ':id',
                component: Iso8583DetailsComponent,
                canActivate: [AuthGuard],
                data: {
                  operations: 'VIEW_EXT_ISO8583'
                }
              }
            ]
          },
         
          {
            path: 'institution',
            component: InstitutionComponent,
            canActivate: [AuthGuard],
            data: {
              operations: 'VIEW_INSTITUTION'
            }
          },
          {
            path: 'pan',
            component: PanComponent,
            canActivate: [],
            data: {
              operations: ''
            }
          },
          {
            path: 'merchant',
            component: MerchantComponent,
            canActivate: [],
            data: {
              operations: ''
            }
          },
          {
            path: 'keys',
            component: KeysComponent,
            canActivate: [],
            data: {
              operations: ''
            }
          },
          {
            path: 'JSON',
            children: [
              {
                path: '',
                component: ExtIntJsonComponent,
                canActivate: [AuthGuard],
                data: {
                  operations: 'VIEW_EXT_JSON'
                },
              },
              {
                path: ':id',
                component: JsonDetailsComponent,
                canActivate: [AuthGuard],
                data: {
                  operations: 'VIEW_EXT_JSON'
                }
              }
            ]
          },
        ]
      },
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'unauthorized',
        component: UnauthorizedScreenComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'auth/login',}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
