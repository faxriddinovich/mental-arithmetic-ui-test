export interface Session {
  id: number;
  username: string;
  session: string;
  date: string;
  role: string;
}

export interface Setting {
  key: string;
  value: any;
}
