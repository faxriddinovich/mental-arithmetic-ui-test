export interface AccountContract {
  id: number;
  balance: string;
  username: string;
  email: string;
  blocked: boolean;
}

export interface AccountCredentialsContract {
  // one of these fields must be included
  username?: string;
  email?: string;
  password: string;
  captcha: string;
}

export interface SessionContract {
  id: number;
  username: string;
  role: string;
  session: string;
}
