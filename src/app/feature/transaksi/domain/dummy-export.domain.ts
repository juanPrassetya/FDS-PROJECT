export interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

export interface ExportColumn {
  title: string;
  dataKey: string;
}

export interface ImportColumnTransaksi {
  file: any;
  filename: string;
}
