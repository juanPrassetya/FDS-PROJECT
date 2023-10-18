export class TransaksiGenerate {
  static readonly type = '[Transaksi] GenerateTransaksi'

  constructor(
    public id: number,
    public startDate: string,
    public endDate: string,
  ) {
  }
}

export class TransaksiGet {
  static readonly type = '[Transaksi] GetList';
}

export class TransaksiDelete {
  static readonly type = '[Transaksi] Delete';

  constructor(
    public id: number
  ) {
  }
}

export class ImportTransaksi {
  static readonly type = '[Transaksi] Import';
  constructor(
    public file: any,
    public filename: string
  ) {}
}

export class ExportTransaksi {
  static readonly type = '[Transaksi] Export';

  constructor(public id: number, public format: string, public username: string, public name: string) {}
}
