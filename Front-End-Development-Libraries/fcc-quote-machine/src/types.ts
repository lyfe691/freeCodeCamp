export interface Quote {
  quote: string;
  author: string;
}

export interface QuotesApiResponse {
  quotes: Quote[];
} 