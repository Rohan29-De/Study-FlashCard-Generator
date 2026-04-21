declare module 'pdf-parse' {
  export interface PDFParseOptions {
    data: Buffer | Uint8Array;
    password?: string;
    verbosity?: number;
  }

  export interface TextResult {
    text: string;
    total: number;
    pages: Array<{ text: string; num: number }>;
  }

  export class PDFParse {
    constructor(options: PDFParseOptions);
    getText(params?: any): Promise<TextResult>;
    getInfo(params?: any): Promise<any>;
    destroy(): Promise<void>;
  }
}
