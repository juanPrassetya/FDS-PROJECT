import {FiltrationDomain} from "./filtration.domain";

export class AggregateDomain {
  id!: bigint
  name: string = ''
  cycleType: number = 0
  aggregatingEntity: string = ''
  attribute: string = ''
  metricType: number = 0
  incrementationMode: number = 0
  timeStartCycle: number = 0
  timeEndCycle: number = 0
  description: string = ''
  isFormulaEnabled: boolean = false
  formula: string = ''
  filtrations: FiltrationDomain[] = []
}
