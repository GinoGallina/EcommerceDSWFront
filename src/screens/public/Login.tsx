import { Card, CardBody, Col } from 'react-bootstrap';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { LocalStorage } from '../../app/LocalStorage';
import { Link, useNavigate } from 'react-router';
import Label from '../../components/Label/Label';
import Input from '../../components/Input/Input';
import Toast from '../../components/Toast/Toast';
import Loader from '../../components/Loader/Loader';
import { TokenData } from '../../interfaces/LoginInterface';
import Button from '../../components/Button/Button';
import './login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (value: string, input: string) => {
        setForm({ ...form, [input]: value });
    };

    const handleSubmit = () => {
        if (loading) return;

        if (!form.email || !form.password) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setLoading(true);

        const rq = {
            email: form.email.trim(),
            password: form.password.trim(),
        };

        API.post<TokenData>('auth/login', rq)
            .then((response) => {
                if (response) {
                    handleLogin(response.data);
                    navigate('/');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleLogin = (data: TokenData) => {
        LocalStorage.setToken(data.token);
        LocalStorage.setUserId(data.user.id);
        LocalStorage.setUserRoles(data.user.roles);
        LocalStorage.setUserName(data.user.username);
        LocalStorage.setUserEmail(data.user.email);
        LocalStorage.setSessionExpiration(data.sessionExpiration);
    };

    return (
        <>
            <ToastContainer />
            <div className="d-flex login-container px-4">
                <Card className="shadow mx-auto my-auto card-container">
                    <h3 className="text-center mt-4">Iniciar sesión</h3>
                    <CardBody>
                        <Col xs={12}>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(value) => handleInputChange(value, 'email')}
                                submitOnEnter
                                onSubmit={handleSubmit}
                            />
                        </Col>
                        <Col xs={12} className="mt-4 pb-4">
                            <Label>Contraseña</Label>
                            <Input
                                type="password"
                                value={form.password}
                                onChange={(value) => handleInputChange(value, 'password')}
                                submitOnEnter
                                onSubmit={handleSubmit}
                            />
                        </Col>
                        <Col xs={12} className="text-center">
                            <Link to="/register">No tienes cuenta? Registrate</Link>
                        </Col>
                        <Col xs={12} className="d-flex mt-4">
                            <Button className="w-100" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader /> : 'ACCEDER'}
                            </Button>
                        </Col>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default Login;
