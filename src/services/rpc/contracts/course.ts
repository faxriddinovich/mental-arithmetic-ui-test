export interface CourseContract {
  id: number;
  title: string;
  description: string;
  image: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  lessonsCount: number;
  tasksCount: number;
  purchasedCount: number;
  ratingAvg: number;
  author: {
    id: number;
    username: string;
    blocked: boolean;
    role: string;
  };
}

export interface RawCourseContract {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string | null;
  price: number;
  coupon: string | null;
  tags: string[];
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseContract {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  coupon?: string;
  price?: number;
  image?: string;
}

export interface UpdateCourseContract {
  courseId: number;
}

export type PossibleKinds = 0 | 1;
export interface GetCoursesContract {
  kind?: PossibleKinds;
  searchText?: string;
  filter?: string[];
}
