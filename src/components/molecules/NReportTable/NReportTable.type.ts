export interface Report {
  meta: ReportMeta;
  items: ReportItem[];
}

export interface ReportMeta {
  title: string;
  subtitle: string;
  rowCount: number;
  columnCount: number;
}

export type ReportItemType = 'section' | 'subsection' | 'item';
export type ReportItemNotation = 'positive' | 'negative' | null;

export interface ReportItem {
  rowNumber: number;
  rowText: string;
  columnNumber: number;
  columnText: string | null;
  type: ReportItemType;
  amount: string;
  notation: ReportItemNotation;
  categoryName?: string;
  categoryId?: string;
  calculatedOf?: {
    text: string;
    type: string;
  }[];
}
