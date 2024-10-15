interface ProductEntity {
  name: string;
  price: number;
  image: string;
  stock: number;
  category: number;
}

interface productCreate extends Omit<ProductEntity, "image"> {}
interface ProductFirebase extends ProductEntity {
  id: string;
}

interface ProductCardStores extends ProductFirebase {
  quantity: number;
}

interface ProductOrders extends Omit<ProductCardStores, "stock"> {}

interface Orders {
  id: string;
  total: number;
  subTotal: number;
  taxes: number;
  discount: number;
  id_coupon: string;
  products: ProductOrders[];
  createdAt: string;
}

interface Coupon {
  nameCoupon: string;
  category: number;
  discount: number;
  quantity: number;
}

interface CouponFirebase extends Coupon {
  id: string;
  createdAt: string;
}

interface UsageCoupon {
  couponId: string;
  quantity: number;
}

interface UsageCouponFirebase extends UsageCoupon {
  id: string;
  createdAt: string;
}

interface UsageCouponFirebaseWithCoupon extends UsageCouponFirebase {
  nameCoupon: string;
  discount: number;
  category: number;
}

export type {
  ProductEntity,
  productCreate,
  ProductFirebase,
  ProductCardStores,
  Orders,
  Coupon,
  CouponFirebase,
  UsageCoupon,
  UsageCouponFirebase,
  UsageCouponFirebaseWithCoupon,
};
