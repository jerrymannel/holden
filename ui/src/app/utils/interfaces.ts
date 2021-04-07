export interface UserDetails {
  _id?: string;
  token?: string;
}

export interface GetOptions {
  page?: number;
  count?: boolean;
  limit?: number;
  select?: string;
  sort?: string;
  filter?: any;
  app?: string;
  noApp?: boolean;
  serviceIds?: string;
  url?: string;
  username?: string;
  password?: string;
}

export interface Environment {
  _id?: string;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  app?: string;
  dataServices?: EnvironmentDataService;
}

export interface EnvironmentDataService {
  _id?: string;
  name?: string;
}

export interface DatasetString {
  _id?: string;
  data?: [string];
}

export interface DatasetNumber {
  _id?: string;
  data?: [string];
}
export interface DatasetObject {
  _id?: string;
  data?: [any];
}
