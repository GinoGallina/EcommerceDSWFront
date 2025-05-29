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

const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to="/login" />);
const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" />);
const SellerAdminRoute = () => (App.isSeller() || App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" />);

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
                <Route
                    path="/"
                    element={
                        <DefaultLayout>
                            <Home />
                        </DefaultLayout>
                    }
                />

                {/* Products */}
                <Route path="/productos" element={<PrivateRoute />}>
                    <Route
                        path="/productos/list"
                        element={
                            <DefaultLayout>
                                <ProductList />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/productos/:id"
                        element={
                            <DefaultLayout>
                                <ProductDetails />
                            </DefaultLayout>
                        }
                    />
                </Route>

                {/* Catgorias */}
                <Route path="/categorias" element={<AdminRoute />}>
                    <Route
                        path="/categorias/list"
                        element={
                            <DefaultLayout>
                                <CategoryList />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/categorias/:id"
                        element={
                            <DefaultLayout>
                                <CreateCategory isWatching />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/categorias/edit/:id"
                        element={
                            <DefaultLayout>
                                <CreateCategory />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/categorias/new"
                        element={
                            <DefaultLayout>
                                <CreateCategory />
                            </DefaultLayout>
                        }
                    />
                </Route>

                {/* Métodos de pago */}
                <Route path="/metodosPago" element={<AdminRoute />}>
                    <Route
                        path="/metodosPago/list"
                        element={
                            <DefaultLayout>
                                <PaymentTypeList />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/metodosPago/:id"
                        element={
                            <DefaultLayout>
                                <CreatePaymentType isWatching />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/metodosPago/edit/:id"
                        element={
                            <DefaultLayout>
                                <CreatePaymentType />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/metodosPago/new"
                        element={
                            <DefaultLayout>
                                <CreatePaymentType />
                            </DefaultLayout>
                        }
                    />
                </Route>

                {/* Productos Seller */}
                <Route path="/misProductos" element={<SellerAdminRoute />}>
                    <Route
                        path="/misProductos/list"
                        element={
                            <DefaultLayout>
                                <MyProductList />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/misProductos/new"
                        element={
                            <DefaultLayout>
                                <CreateProduct />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/misProductos/:id"
                        element={
                            <DefaultLayout>
                                <CreateProduct isWatching />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/misProductos/edit/:id"
                        element={
                            <DefaultLayout>
                                <CreateProduct />
                            </DefaultLayout>
                        }
                    />
                </Route>
            </Route>

            {/* Order */}
            <Route path="/carrito" element={<PrivateRoute />}>
                <Route
                    path="/carrito/confirmar"
                    element={
                        <DefaultLayout>
                            <ConfirmOrder />
                        </DefaultLayout>
                    }
                />
            </Route>

            <Route path="/ordenes" element={<PrivateRoute />}>
                <Route
                    path="/ordenes/misCompras"
                    element={
                        <DefaultLayout>
                            <OrderList />
                        </DefaultLayout>
                    }
                />
                <Route
                    path="/ordenes/:id"
                    element={
                        <DefaultLayout>
                            <OrderDetails />
                        </DefaultLayout>
                    }
                />
            </Route>

            {/* Usuario */}
            <Route path="/usuarios" element={<AdminRoute />}>
                <Route
                    path="/usuarios/list"
                    element={
                        <DefaultLayout>
                            <UserList />
                        </DefaultLayout>
                    }
                />
                <Route
                    path="/usuarios/new"
                    element={
                        <DefaultLayout>
                            <CreateUser />
                        </DefaultLayout>
                    }
                />
                <Route
                    path="/usuarios/:id"
                    element={
                        <DefaultLayout>
                            <CreateUser isWatching />
                        </DefaultLayout>
                    }
                />
                <Route
                    path="/usuarios/edit/:id"
                    element={
                        <DefaultLayout>
                            <CreateUser />
                        </DefaultLayout>
                    }
                />
            </Route>

            {/* Usuario compartido */}
            <Route path="/usuarios" element={<PrivateRoute />}>
                <Route
                    path="/usuarios/detallesPerfil/:id"
                    element={
                        <DefaultLayout>
                            <CreateUser viewProfileDetails />
                        </DefaultLayout>
                    }
                />
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="/notAllowed" element={<NotAllowed />} />
            <Route path="/login" element={!App.isLoggedIn() ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!App.isLoggedIn() ? <Register /> : <Navigate to="/" />} />
        </Routes>
    </Suspense>
);
