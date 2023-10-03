import {MerchantDomain} from "../domain/merchant.domain";

export class MerchantGet {
  static readonly type = '[Merchant] FetchMerchant'
}

export class MerchantGetQuery {
  static readonly type = '[Merchant] FetchMerchantQuery'
  constructor(public data: any) {}
}

export class MerchantAdd {
  static readonly type = '[Merchant] MerchantAdd'
  constructor(
    public data: MerchantDomain
  ) {
  }
}

export class MerchantUpdate {
  static readonly type = '[Merchant] MerchantUpdate'

  constructor(
    public currentName: string,
    public data: MerchantDomain
  ) {
  }
}

export class MerchantDelete {
  static readonly type = '[Merchant] MerchantDelete'

  constructor(
    public id: number
  ) {
  }
}
