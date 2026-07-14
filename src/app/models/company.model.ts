export interface Company {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  companyName: string;
  sector: string;
  address: string;
  website: string;
  logo: string;
  description: string;
}

export interface CompanyUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  sector?: string;
  address?: string;
  website?: string;
  logo?: string;
  description?: string;
}