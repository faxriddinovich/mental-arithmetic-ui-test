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

export interface UpdateAccountContract {
  accountId: number,
  username?: string,
  email?: string,
  password?: string,
  role?: string,
  balance?: number,
}

export interface UpdateOwnAccountContract {
  username?: string,
  email?: string,
  password?: string
}

export interface CreateAccountContract {
  username: string,
  role: string,
  password: string,
  captcha: string,
  email?: string
}
