import {AbstractControl, ValidatorFn} from "@angular/forms";

export class StringUtils {
  static capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static dummyHistory = [
    {code: 'CARD'},
    {code: 'TERMINALID'},
    {code: 'MERCHANTID'},
    {code: 'CUSTOMERID'},
  ]

  static dummyDepth = [
    {code: '0'}, {code: '1'}, {code: '2'}, {code: '3'},
    {code: '4'}, {code: '5'}, {code: '6'},
    {code: '7'}, {code: '8'}, {code: '9'},
    {code: '10'}
  ];

  static priority = [
    {code: '1'}, {code: '2'}, {code: '3'},
    {code: '4'}, {code: '5'}, {code: '6'},
    {code: '7'}, {code: '8'}, {code: '9'},
    {code: '10'}
  ];

  static findOperations(authorities: string[], op: string) {
    return authorities.find(v1 => v1.includes(op)) != undefined
  }

  static dummyPriority = [
    {code: 1}, {code: 2}, {code: 3},
    {code: 4}, {code: 5}, {code: 6},
    {code: 7}, {code: 8}, {code: 9},
    {code: 10}
  ]

  static dummyFieldType = [
    {
      code: true,
      name: 'TLV'
    },
    {
      code: false,
      name: 'Common'
    },
  ]

  static dummyAction = [
    {name: 'CREATE_ALERT', code: 'Create Alert'},
    {name: 'SET_RESPCODE', code: 'Set Response Code'},
    {name: 'SMS_NOTIFICATION', code: 'SMS Notification'},
    {name: 'EMAIL_NOTIFICATION', code: 'Email Notification'},
    {name: 'ATTR_BLACK_LIST', code: 'Put attribute to black list'},
    {
      name: 'ATTR_FRAUD_LIST',
      code: 'Put attribute to list'
    },
    {name: 'ATTR_WHITE_LIST', code: 'Put attribute to white list'},
  ]

  static dummyRecipientType = [
    {name: 'Recipient', code: 'RECIPIENT'},
    {name: 'Recipient Group', code: 'RECIPIENT_GROUP'},
  ]

  static dummyZone = [
    {name: 'BLACK'}, {name: 'GREY'}, {name: 'WHITE'}
  ]

  static dummyStatus = [
    {name: 'Active', code: true},
    {name: 'Not Active', code: false}
  ]

  static dummyOption = [
    {name: 'Yes', code: true},
    {name: 'No', code: false}
  ]

  static dummyUserType = [
    {id: 1, typeName: 'TYPE_ADMIN'},
    {id: 2, typeName: 'TYPE_USER'},
  ]

  static dummyMetric = [
    {
      name: 'Count Matched',
      code: 1
    },
    {
      name: 'Count Different',
      code: 2
    },
    {
      name: 'Sum Amount Matched',
      code: 3
    },
    {
      name: 'Sum Amount Different',
      code: 4
    },
    // {
    //   code: 'Amount'
    // },
    // {
    //   code: 'Mean Amount'
    // },
  ]

  static dummyIncMode = [
    {
      name: 'On original transaction',
      code: 1
    },
  ]

  static dummyCommonEncoding = [
    {
      encodingId: 1,
      encodingType: 'ASCII'
    },
    {
      encodingId: 2,
      encodingType: 'BINARY'
    },
    {
      encodingId: 4,
      encodingType: 'EBCDIC'
    },
  ]

  static dummyTlvEncoding = [
    {
      encodingId: 3,
      encodingType: 'ASCIITLV'
    },
  ]

  static dummyCommonFormat = [
    {
      formatId: 1,
      formatType: 'NUMERIC'
    },
    {
      formatId: 2,
      formatType: 'LLVAR'
    },
    {
      formatId: 3,
      formatType: 'LLLVAR'
    },
    {
      formatId: 4,
      formatType: 'BITMAP'
    },
    {
      formatId: 5,
      formatType: 'BINARY'
    },
    {
      formatId: 8,
      formatType: 'LLHVAR'
    },
    {
      formatId: 9,
      formatType: 'LLHBINARY'
    },
    {
      formatId: 10,
      formatType: 'LLLBINARY'
    },
  ]

  static dummyTLVFormat = [
    {
      formatId: 6,
      formatType: 'LLTLV'
    },
    {
      formatId: 7,
      formatType: 'LLLTLV'
    },
  ]

  static dummyPlaceHolder = [
    {
      code: '<hpan>',
      name: 'HPAN'
    },
    {
      code: '<terminalId>',
      name: 'Terminal Id'
    },
    {
      code: '<sysdate>',
      name: 'Date'
    },
    {
      code: '<currency>',
      name: 'Currency'
    },
    {
      code: '<refnum>',
      name: 'Reference Number'
    },
    {
      code: '<transType>',
      name: 'Transaction Type'
    },
    {
      code: '<respCode>',
      name: 'Response Code'
    },
    {
      code: '<merchantType>',
      name: 'Merchant Type'
    },
    {
      code: '<rule>',
      name: 'Rule'
    },
    {
      code: '<rule_description>',
      name: 'Rule Description'
    },
  ]

  static dummyHasHeader = [
    {name: 'Active', code: true},
    {name: 'Not Active', code: false},
  ];

  static dummyActionType = [
    {name: 'Add Alert Comment', code: '91'},
    {name: 'Forward To', code: '92'},
    {name: 'Add Card to List', code: '93'},
    {name: 'Add Account to List', code: '94'},
    {name: 'Add Merchant to List', code: '95'},
    {name: 'Add Terminal to List', code: '96'},
    {name: 'Remove Card from List', code: '70'},
    {name: 'Remove Account from List', code: '71'},
    {name: 'Remove Merchant from List', code: '72'},
    {name: 'Remove Terminal from List', code: '73'},
    {name: 'Put Card in Whitelist', code: '82'},
    {name: 'Put Account in Whitelist', code: '83'},
    {name: 'Put Merchant in Whitelist', code: '84'},
    {name: 'Put Terminal in Whitelist', code: '85'},
    {name: 'Put Card in Blacklist', code: '86'},
    {name: 'Put Account in Blacklist', code: '87'},
    {name: 'Put Merchant in Blacklist', code: '88'},
    {name: 'Put Terminal in Blacklist', code: '89'}
  ]

  static converterStatus(stat: boolean | undefined) {
    return stat ? 'Active' : 'Not Active'
  }

  static converterOption(stat: boolean | undefined) {
    return stat ? 'Yes' : 'No'
  }

  static isAvailable(value: any) {
    return value != '' && value != undefined
  }

  static isFormatLL(value: any) {
    if (value != '')
      return value.formatType.startsWith('LL')

    return true
  }

  static getFieldFormat(value: boolean) {
    if (value) {
      return this.dummyTLVFormat
    }
    return this.dummyCommonFormat
  }

  static getFieldEncoding(value: boolean) {
    if (value) {
      return this.dummyTlvEncoding
    }
    return this.dummyCommonEncoding
  }

  static charReplacement(value: string) {
    if (value != undefined) {
      return value.replace('_', ' ')
    }
    return value
  }
}

export function maxThreeDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 3), 10);
      value = Math.min(Math.max(value, 0), 100);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}

export function maxHoursValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 2), 10);
      value = Math.min(Math.max(value, 0), 24);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}

export function maxMinValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 2), 10);
      value = Math.min(Math.max(value, 0), 60);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}

export function commonFieldTypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 4), 10);
      value = Math.min(Math.max(value, 0), 9999);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}

export function LLFieldTypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 2), 10);
      value = Math.min(Math.max(value, 0), 99);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}

export function LLLFieldTypeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 3), 10);
      value = Math.min(Math.max(value, 0), 999);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}

export function maxFieldIdValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      let value = parseInt(control.value.toString().slice(0, 3), 10);
      value = Math.min(Math.max(value, 0), 128);
      try {
        control.setValue(value, {emitEvent: false});
      } catch (e) {

      }
    }
    return null;
  };
}
