export class TransactionTypeDomain {
  id!: number;
  transType: string = '';
  configId!: bigint | undefined;
  intTransType: bigint | undefined

  constructor(configId: bigint | undefined) {
    this.configId = configId;
  }
}
