export interface Session {
  id: number;
  username: string;
  session: string;
  date: string;
}

export interface Setting {
  key: string;
  value: any;
}
