import {UserDomain} from "../../user/domain/user.domain";

export class UserAuditDomain {
  auditId!: bigint
  captureDate: string = ''
  timeStamp!: bigint
  timeTaken: string = ''
  status: number = 0
  method: string = ''
  uri: string = ''
  host: string = ''
  userAgent: string = ''
  remoteAddress: string = ''
  reqContentType: string = ''
  respContentType: string = ''
  user!: UserDomain
}
