import { FetchModel } from './generic';

export type RequestStatus = 'pending' | 'preparing' | 'resolving' | 'resolved' | 'rejected';

export type Estimation = 'High' | 'Medium' | 'Low';

export type Priority = Estimation;

export type Agency = {
  address: string;
  agency_name: string;
  code: string;
  id: string;
  phone: string;
};

export type Request = {
  id: string;
  code: string;
  customer: FetchModel;
  name: string;
  createdAt: Date;
  contract: any;
  rejectReason: string;
  cancelReason: string;
  service: FetchModel;
  agency: FetchModel;
  priority: Priority;
  description: string;
  status: RequestStatus;
  createdBySystem?: boolean;
  createdByAdmin?: boolean;
  technician: any;
  startTime?: Date | null;
  endTime?: Date | null;
  duration_time?: string | null;
  createdBy: Date;
};
