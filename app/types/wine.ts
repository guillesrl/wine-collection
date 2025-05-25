export interface Wine {
  Id: number;
  Title: string;
  Vintage: number;
  Country: string;
  County: string | null;
  Designation: string | null;
  Points: number;
  Price: number | null;
  Province: string | null;
  Variety: string | null;
  Winery: string | null;
}

export interface NewsletterSubscription {
  email: string;
  created_at?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
