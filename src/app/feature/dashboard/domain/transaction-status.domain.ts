export class TransactionStatusDomain {
  id!: bigint
  fraudCategory: string = '';
  month: string = '';
  totalCount: number = 0;
  prevMountCount: number = 0
  increment: number = 0;
  incrementPercentage: number = 0;

}
