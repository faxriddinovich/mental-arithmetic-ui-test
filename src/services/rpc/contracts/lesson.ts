export interface LessonContract {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tasks: number;
  comments: number;
  course: {
    id: number;
    title: string;
  };
  author: {
    id: number;
    username: string;
    blocked: boolean;
    role: string;
  };
}

export interface CommentContract {
  id: number;
  body: string;
  creator: {
    id: number;
    username: string;
    blocked: boolean;
    role: string;
  };
}
