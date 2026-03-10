
export interface IOrderItem {
  productID: string; 
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  _id?: string; 
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  transactionId: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: string; 
}