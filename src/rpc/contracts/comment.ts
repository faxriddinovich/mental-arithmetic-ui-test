export interface CommentContract {
  id: number,
  body: string,
  createdAt: string,
  updatedAt: string,
  creator: {
    id: number,
    username: string,
    blocked: boolean,
    role: string
  }
}

