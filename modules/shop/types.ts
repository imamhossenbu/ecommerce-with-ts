export interface IProduct {
  _id: string; 
  name: string;
  description: string;
  straight_up?: string; 
  lowdown: string[]; 
  regularPrice: number;
  salePrice: number;
  thumbnail: string;
  images: string[];
  categoryID: string; 
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  createdAt?: string;
  updatedAt?: string;
  avgRating:number;
  totalReviews:number;
}


export interface CartItem extends IProduct {
  quantity: number;
}