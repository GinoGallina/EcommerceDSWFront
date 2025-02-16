import { Navigate, Outlet, Route, Routes } from 'react-router';
import { lazy, Suspense } from 'react';
// import App from '../app/App.js';
import { Spinner } from '../components/index.tsx';
import App from '../app/App.ts';

// const Home = lazy(() => import('../screens/main/Home.jsx'));
const NotAllowed = lazy(() => import('../screens/public/NotAllowed.tsx'));
const Login = lazy(() => import('../screens/public/Login.jsx'));
const NotFound = lazy(() => import('../screens/public/NotFound.jsx'));
const DefaultLayout = lazy(() => import('./DefaultLayout.jsx'));

// Lazy loading de componentes

const PrivateRoute = () => (App.isLoggedIn() ? <Outlet /> : <Navigate to="/login" />);

// const PrivateRoute = () => (App.isAdmin() ? <Outlet /> : <Navigate to='/notAllowed' />);

// const PrivateRoute = () => (App.isDealer() ? <Outlet /> : <Navigate to='/notAllowed' />);

export const AppRoutes = () => (
    <Suspense
        fallback={
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh', backgroundColor: '#eef5f9' }}
            >
                <Spinner></Spinner>
            </div>
        }
    >
        <Routes>
            <Route path="/" element={<PrivateRoute />}>
                <Route
                    path="/"
                    element={
                        <DefaultLayout>
                            {/* <Home /> */}
                            <Login />
                        </DefaultLayout>
                    }
                />

                {/* Products */}
                <Route path="/productos" element={<PrivateRoute />}>
                    <Route
                        path="/productos/list"
                        // element={
                        //     <DefaultLayout>
                        //         <ProductList />
                        //     </DefaultLayout>
                        // }
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
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/notAllowed" element={<NotAllowed />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </Suspense>
);
