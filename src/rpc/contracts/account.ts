export interface AccountContract {
  id: number;
  balance: string;
  username: string;
  email: string;
  blocked: boolean;
}

export interface SessionContract {
  id: number;
  username: string;
  role: string;
  session: string;
}
