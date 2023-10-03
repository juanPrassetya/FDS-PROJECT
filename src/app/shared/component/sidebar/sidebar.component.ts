import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {StringUtils} from "../../utils/string.utils";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  protected StringUtils = StringUtils

  authorities: string[] = []

  menuList = [
    {
      "text": "Dashboard",
      "icon": "bx bxl-deezer",
      "routerLink": "dashboard",
      "operation": "VIEW_DASHBOARD"
    },
    {
      "text": "Transaction Test",
      "icon": "bx bx-child",  
      "routerLink": "transaction-test",
      "operation": ""
    },
    {
      "text": "Transaction",
      "icon": "bx bx-candles",  
      "routerLink": "transaction",
      "operation": "VIEW_TRANSACTION"
    },
    {
      "text": "Fraud Management",
      "icon": "bx bx-shield-plus",
      "operation": "FRAUD_MANAGEMENT_MENU",
      "children": [
       
        {
          "text": "Alert Investigation",
          "routerLink": "fraud-management/alert-investigation",
          "operation": "VIEW_ALERT"
        },
        {
          "text": "Fraud Reactions",
          "routerLink": "fraud-management/fraud-reactions",
          "operation": "VIEW_REACTIONS"
        },
        {
          "text": "Fraud List",
          "routerLink": "fraud-management/fraud-list",
          "operation": "VIEW_FRAUD_LIST"
        },
        {
          "text": "White List",
          "routerLink": "fraud-management/white-list",
          "operation": "VIEW_WHITE_LIST"
        },
        {
          "text": "Black List",
          "routerLink": "fraud-management/black-list",
          "operation": "VIEW_BLACK_LIST"
        },
        {
          "text": "Rule Group",
          "routerLink": "fraud-management/rule-group",
          "operation": "VIEW_RULE_GROUP"
        },
        {
          "text": "Rule",
          "routerLink": "fraud-management/rule",
          "operation": "VIEW_RULE"
        }
      ]
    },
    {
      "text": "Test Data", //sebelumnya ext-int 
      "icon": "bx bx-coin-stack",
      "operation": "EXT_INT_MENU",
      "children": [
        {
          "text": "Terminal",//tadinya ISO8583 (ext-int-iso8583) diganti jadi Terminal
          "routerLink": "ext-interfaces/ISO8583",
          "operation": "VIEW_EXT_ISO8583",
        },
        
        {
          "text": "JSON",
          "routerLink": "ext-interfaces/JSON",
          "operation": "VIEW_EXT_JSON",
        },
        {
          "text": "Institution",
          "routerLink": "ext-interfaces/institution",
          "operation": "VIEW_INSTITUTION",
        },
        {
          "text": "PAN",
          "routerLink": "ext-interfaces/pan",
          "operation": "",
        },
        {
          "text": "Merchant",
          "routerLink": "ext-interfaces/merchant",
          "operation": "",
        },
        {
          "text": "Keys",
          "routerLink": "ext-interfaces/keys",
          "operation": "",
        }
      ]
    },
    {
      "text": "Notifications",
      "icon": "bx bx-bell",
      "operation": "NOTIFICATION_MENU",
      "children": [
        {
          "text": "Notification Template",
          "routerLink": "notification-template/template-setup",
          "operation": "VIEW_NOTIF_TEMP",
        },
        {
          "text": "Recipient Setup",
          "routerLink": "notification-template/recipient-setup",
          "operation": "VIEW_RECIPIENT_SETUP",
        },
        {
          "text": "Recipient Group",
          "routerLink": "notification-template/recipient-group",
          "operation": "VIEW_RECIPIENT_GROUP",
        },
      ]
    },
    // {
    //   "text": "System Parameters",
    //   "icon": "bx bxl-codepen",
    //   "operation": "SYSTEM_PARAM",
    //   "children": [
    //     {
    //       "text": "Transaction Parameter",
    //       "routerLink": "system-parameters/transaction-parameter",
    //       "operation": "VIEW_ALERT"
    //     },
    //     {
    //       "text": "Response Code",
    //       "routerLink": "system-parameters/response-code",
    //       "operation": "VIEW_ALERT"
    //     },
    //     {
    //       "text": "Transaction Type",
    //       "routerLink": "system-parameters/transaction-type",
    //       "operation": "VIEW_ALERT"
    //     },
    //     // {
    //     //   "text": "Aid Parameter",
    //     //   "routerLink": "system-parameters/aid-parameter",
    //     //   "operation": "VIEW_ALERT"
    //     // }
    //   ]
    // },
    // {
    //   "text": "Statistic Setup",
    //   "icon": "bx bx-objects-vertical-bottom",
    //   "routerLink": "/statistic-setup"
    // },
    {
      "text": "Report",
      "icon": "bx bx-notepad",
      "routerLink": "report",
      "operation": "VIEW_REPORT"
    },
    {
      "text": "User Management",
      "icon": "bx bx-group",
      "operation": "USER_MENU",
      "children": [
        {
          "text": "User",
          "routerLink": "user-management/user",
          "operation": "VIEW_USER",
        },
        {
          "text": "Role",
          "routerLink": "user-management/role",
          "operation": "VIEW_ROLE",
        },
        {
          "text": "Group",
          "routerLink": "user-management/group",
          "operation": "VIEW_USER_GROUP",
        },
        {
          "text": "Audit",
          "routerLink": "user-management/audit",
          "operation": "VIEW_USER_AUDIT",
        }
      ]
    }
  ];

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authorities = this.authService.getAuthorities()
  }
}
