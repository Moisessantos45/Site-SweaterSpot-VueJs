import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import ProductsView from "../views/admin/ProductsView.vue";
import AdminLayout from "../Layouts/AdminLayout.vue";
import SalesView from "../views/admin/SalesView.vue";
import ProductCreateView from "../views/admin/ProductCreateView.vue";
import SenderView from "../views/admin/SenderView.vue";
import CouponView from "@/views/admin/CouponView.vue";

const routers: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminLayout,
    children: [
      {
        path: "products",
        name: "Products",
        component: ProductsView,
      },
      {
        path: "product/create/:id?",
        name: "ProductCreate",
        component: ProductCreateView,
      },
      {
        path: "product/sender",
        name: "ProductSender",
        component: SenderView,
      },
      {
        path: "sales",
        name: "Sales",
        component: SalesView,
      },
      {
        path: "coupons",
        name: "Coupons",
        component: CouponView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routers,
});

export default router;
