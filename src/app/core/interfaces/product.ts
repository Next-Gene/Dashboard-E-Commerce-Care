export interface Product {
  id: number
  name: string
  description: string
  price: number
  productBrand: string
  category: string
  productPhotos: ProductPhotos[]
  photoUrl?: string
}

export interface ProductPhotos{
  id: number
  url: string
  isMain: boolean
}

export type APIProductsResponse = Product[];

export interface addProduct {
  name: string;
  price: number;
  description: string;
  categoryId: number;
  productBrandId: number;
  photoUrl?: string;
  productPhotos?: ProductPhotos[];
}


export interface updateProduct {
  id: number
  name: string
  description: string
  price: number
  productPhotos: ProductPhotos[]
  photoUrl: string
}