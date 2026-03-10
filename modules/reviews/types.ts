export interface IReview {
  _id: string;
  comment: string;
  userID: {
    _id: string;
    name: string;
    profileImage?: string;
  };

  productID: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  rating:number;
}

export interface CreateReviewData {
  productID: string;
  userID: string;
  rating: number;
  comment: string;
}