import { Navigate, Outlet, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
import { Spinner } from '../components/index.tsx';
import App from '../app/App.ts';

// Lazy loading de componentes
const NotAllowed = lazy(() => import('../screens/public/NotAllowed.tsx'));
const Login = lazy(() => import('../screens/public/Login.jsx'));
const NotFound = lazy(() => import('../screens/public/NotFound.jsx'));
const DefaultLayout = lazy(() => import('./DefaultLayout.jsx'));
const Home = lazy(() => import('../screens/Home/Home.tsx'));
const ProductList = lazy(() => import('../screens/products/ProductList.tsx'));
const CreateProduct = lazy(() => import('../screens/products/CreateProduct.tsx'));
const CreateCategory = lazy(() => import('../screens/categories/CreateCategory.tsx'));
const CategoryList = lazy(() => import('../screens/categories/CategoryList.tsx'));

const PrivateRoute = () => <Outlet />;
// const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to="/login" />);
const AdminRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to="/notAllowed" />);
// const SellerRoute = () => (App.isSeller() ? <Outlet /> : <Navigate to='/notAllowed' />);
// const UserRoute = () => (App.isUser() ? <Outlet /> : <Navigate to='/notAllowed' />);

export const AppRoutes = () => (
    <Suspense
        fallback={
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh', backgroundColor: '#eef5f9' }}
            >
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
                        // element={
                        //     <DefaultLayout>
                        //         <CreateProduct isWatching />
                        //     </DefaultLayout>
                        // }
                    />
                    <Route
                        path="/productos/edit/:id"
                        // element={
                        //     <DefaultLayout>
                        //         <CreateProduct isEditing />
                        //     </DefaultLayout>
                        // }
                    />
                    <Route
                        path="/productos/new"
                        // element={
                        //     <DefaultLayout>
                        //         <CreateProduct />
                        //     </DefaultLayout>
                        // }
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
                                <CreateCategory isEditing />
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

                {/* Productos Seller */}
                <Route path="/misProductos" element={<PrivateRoute />}>
                    <Route
                        path="/misProductos/list"
                        element={
                            <DefaultLayout>
                                <ProductList />
                            </DefaultLayout>
                        }
                    />
                    <Route
                        path="/misProductos/nuevo"
                        element={
                            <DefaultLayout>
                                <CreateProduct />
                            </DefaultLayout>
                        }
                    />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
            <Route path="/notAllowed" element={<NotAllowed />} />
            <Route path="/login" element={!App.isLoggedIn() ? <Login /> : <Navigate to="/" />} />
        </Routes>
    </Suspense>
);
