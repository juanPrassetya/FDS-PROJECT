import {PrivilegeDomain} from "./privilege.domain";

export class OperationDomain {
  opId!: bigint
  opName: string = ''
  privileges: Array<PrivilegeDomain> = []
}
