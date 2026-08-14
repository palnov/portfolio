export type ServiceCms = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type StudioInfoCms = {
  title: string;
  tagline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  address: string;
  instagramUrl?: string;
  telegramUrl?: string;
  stats: {
    years: string;
    completed: string;
    cars: string;
    rating: string;
  };
};

export interface LeadData {
  name: string;
  phone: string;
  service: string;
  date: string;
  message?: string;
}
