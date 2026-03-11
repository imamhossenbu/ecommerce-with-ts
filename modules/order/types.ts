export interface IOrderItem {
  productID: string; 
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder {
  _id?: string; 
  customerInfo: ICustomerInfo; 
  items: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  transactionId: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: string; 
  updatedAt?: string; 
}

export interface ISalesData {
  name: string;
  revenue: number;
}

export interface ICategoryStat {
  name: string;
  value: number;
}

export interface IRecentOrder {
  _id: string;
  transactionId: string;
  customerInfo: {
    firstName: string;
    lastName: string;
  };
  totalAmount: number;
  orderStatus: string;
}

export interface ITopProduct {
  _id: string;
  name: string;
  thumbnail: string;
  salePrice: number;
}

export interface IDashboardData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
  };
  salesData: ISalesData[];
  categoryStats: ICategoryStat[];
  recentOrders: IRecentOrder[];
  topProducts: ITopProduct[];
}