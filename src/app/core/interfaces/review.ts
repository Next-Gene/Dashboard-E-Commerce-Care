
export interface Review {
  id: number;
  name: string;
  images:string;
  gender: 'male' | 'female';
  time: string;
  comment: string;
  product: {
    name: string;
    image: string;
  };
  rating: number;
}
