import { JsonActionTypeDomain } from "./json-action-type.domain";

export class JsonActionDomain {
    id!: number;
    actionId!: number;
    headerId!: bigint;
    fieldId!: number;
    sequence: number = 0;
    args: string = ''
    type!: JsonActionTypeDomain;
}
