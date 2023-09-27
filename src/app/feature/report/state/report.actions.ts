export class ReportGenerate {
  static readonly type = '[Report] GenerateReport'

  constructor(
    public id: number,
    public startDate: string,
    public endDate: string,
  ) {
  }
}

export class ReportGet {
  static readonly type = '[Report] GetList';
}

export class ReportDelete {
  static readonly type = '[Report] Delete';

  constructor(
    public id: number
  ) {
  }
}

export class ImportReport {
  static readonly type = '[Report] Import';
  constructor(
    public file: any,
    public filename: string
  ) {}
}

export class ExportReport {
  static readonly type = '[Report] Export';

  constructor(public id: number, public format: string, public username: string, public name: string) {}
}
