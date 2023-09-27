import {InstitutionDomain} from "../../institution/domain/institution.domain";
import {UserGroupDomain} from "../../user-group/domain/user-group.domain";
import {UserRoleDomain} from "../../user-role/domain/user-role.domain";

export class UserDomain {
  id!: bigint
  userId: string = ''
  firstName: string = ''
  lastName: string = ''
  username: string = ''
  email: string = ''
  profileImageUrl: string = ''
  lastLoginDate: string = ''
  active: boolean = false
  notLocked: boolean = false
  resetPassword: boolean = false
  type: {id: bigint, typeName: string} | undefined
  institution: InstitutionDomain | undefined
  userGroup: UserGroupDomain | undefined
  role!: UserRoleDomain
}
