export interface Donor {
  uid: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  group: string;
  phone: string;
  altPhone: string;
  address: string;
  lat: number;
  lng: number;
  lastDonationMs: number;
  responseSpeed: number;
  freq: number;
  activeDaysAgo: number;
  distance?: number;
  calcDist?: number;
  smartScore?: number;
  isEligible?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  email: string;
  phone: string;
  landline: string;
}

export interface DonationLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: number;
  bloodGroup: string;
  hospitalName: string;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  bloodGroup: string;
  units: string;
  lat: number;
  lng: number;
  status: string;
  timestamp: number;
}
