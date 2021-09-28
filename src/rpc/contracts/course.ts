export interface CourseContract {
  id: number,
        title: string,
        description: string,
        image: string,
        price: number,
        createdAt: string,
        updatedAt: string,
        lessons: number,
        tasks: number,
        ratingAvg: number,
        purchasedCount: number,
        author: {
id: number,
    username: string,
    blocked: boolean,
    role: string
    }

}

export interface GetCoursesContract {
res: string,
       searchText?: string,
       filter?: string[]
}

export interface CourseCreationContract {
  title: string,
  description: string,
  category: string,
  tags?: string[],
  coupon?: string,
  price?: number,
  image?: string
}

