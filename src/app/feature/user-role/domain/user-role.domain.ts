import {OperationDomain} from "./operation.domain";

export class UserRoleDomain {
  roleId!: bigint
  roleName: string = ''
  operations: Array<OperationDomain> = []
}
