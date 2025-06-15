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
