export interface AccountContract {
  id: number;
  balance: string;
  username: string;
  email: string;
  blocked: boolean;
}

export interface AuthAccountContract {
  id: number;
  username: string;
  role: string;
  session: string;
}
