import { Navigate, Outlet, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import { Spinner } from '../components/index.tsx';
import App from '../app/App.ts';

// Lazy loading de componentes
const NotAllowed = lazy(() => import('../screens/public/NotAllowed.tsx'));
const Login = lazy(() => import('../screens/public/Login.jsx'));
const Register = lazy(() => import('../screens/public/Register.jsx'));
const NotFound = lazy(() => import('../screens/public/NotFound.jsx'));
const DefaultLayout = lazy(() => import('./DefaultLayout.jsx'));
const Home = lazy(() => import('../screens/Home/Home.tsx'));
const ProductList = lazy(() => import('../screens/products/ProductList.tsx'));
const MyProductList = lazy(() => import('../screens/products/MyProductList.tsx'));
const CreateProduct = lazy(() => import('../screens/products/CreateProduct.tsx'));
const CreateCategory = lazy(() => import('../screens/categories/CreateCategory.tsx'));
const CategoryList = lazy(() => import('../screens/categories/CategoryList.tsx'));
const CreatePaymentType = lazy(() => import('../screens/paymentTypes/CreatePaymentType.tsx'));
const PaymentTypeList = lazy(() => import('../screens/paymentTypes/PaymentTypeList.tsx'));
const ConfirmOrder = lazy(() => import('../screens/order/ConfirmOrder.tsx'));
const OrderList = lazy(() => import('../screens/order/OrderList.tsx'));
const OrderDetails = lazy(() => import('../screens/order/OrderDetails.tsx'));
const UserList = lazy(() => import('../screens/users/UserList.tsx'));
const CreateUser = lazy(() => import('../screens/users/CreateUser.tsx'));
const ProductDetails = lazy(() => import('../screens/products/Details/ProductDetails.tsx'));

const PrivateRoute = () =>
    App.isLoggedIn() ? (
        <DefaultLayout>
            <Outlet />
        </DefaultLayout>
    ) : (
        <Navigate to="/login" />
    );
const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" />);
const SellerAdminRoute = () => (App.isSeller() || App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" />);
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    return App.isLoggedIn() ? <Navigate to="/" /> : <>{children}</>;
};

export const AppRoutes = () => (
    <Suspense
        fallback={
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#eef5f9' }}>
                <Spinner />
            </div>
        }
    >
        <Routes>
            {/* Home */}
            <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />

                {/* Products */}
                <Route path="/productos">
                    <Route path="/productos/list" element={<ProductList />} />
                    <Route path="/productos/:id" element={<ProductDetails />} />
                </Route>

                {/* Catgorias */}
                <Route path="/categorias" element={<AdminRoute />}>
                    <Route path="/categorias/list" element={<CategoryList />} />
                    <Route path="/categorias/:id" element={<CreateCategory isWatching />} />
                    <Route path="/categorias/edit/:id" element={<CreateCategory />} />
                    <Route path="/categorias/new" element={<CreateCategory />} />
                </Route>

                {/* Métodos de pago */}
                <Route path="/metodosPago" element={<AdminRoute />}>
                    <Route path="/metodosPago/list" element={<PaymentTypeList />} />
                    <Route path="/metodosPago/:id" element={<CreatePaymentType isWatching />} />
                    <Route path="/metodosPago/edit/:id" element={<CreatePaymentType />} />
                    <Route path="/metodosPago/new" element={<CreatePaymentType />} />
                </Route>

                {/* Productos Seller */}
                <Route path="/misProductos" element={<SellerAdminRoute />}>
                    <Route path="/misProductos/list" element={<MyProductList />} />
                    <Route path="/misProductos/new" element={<CreateProduct />} />
                    <Route path="/misProductos/:id" element={<CreateProduct isWatching />} />
                    <Route path="/misProductos/edit/:id" element={<CreateProduct />} />
                </Route>

                {/* Order */}
                <Route path="/carrito">
                    <Route path="/carrito/confirmar" element={<ConfirmOrder />} />
                </Route>

                <Route path="/ordenes">
                    <Route path="/ordenes/misCompras" element={<OrderList />} />
                    <Route path="/ordenes/:id" element={<OrderDetails />} />
                </Route>

                {/* Usuario */}
                <Route path="/usuarios" element={<AdminRoute />}>
                    <Route path="/usuarios/list" element={<UserList />} />
                    <Route path="/usuarios/new" element={<CreateUser />} />
                    <Route path="/usuarios/:id" element={<CreateUser isWatching />} />
                    <Route path="/usuarios/edit/:id" element={<CreateUser />} />
                </Route>

                {/* Usuario compartido */}
                <Route path="/usuarios">
                    <Route path="/usuarios/detallesPerfil/:id" element={<CreateUser viewProfileDetails />} />
                </Route>

                <Route path="*" element={<NotFound />} />
                <Route path="/notAllowed" element={<NotAllowed />} />
            </Route>

            <Route
                path="/login"
                element={
                    <PublicOnlyRoute>
                        <Login />
                    </PublicOnlyRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicOnlyRoute>
                        <Register />
                    </PublicOnlyRoute>
                }
            />
        </Routes>
    </Suspense>
);
