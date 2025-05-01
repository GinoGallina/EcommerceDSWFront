import { Card, CardBody, Col } from 'react-bootstrap';
import { useRef, useState } from 'react';
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
import { IRegisterRequest, ITokenResponse } from '../../interfaces/IToken';
import Button from '../../components/Button/Button';

import './register.scss';
import { RolesDropdown } from '../../components';
import { Roles } from '../../app/constants/Roles';
import { GetComboItemType } from '../../interfaces/shared/IGetCombo';
import { useDropdownItems } from '../../hooks/useDropdownItems';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
        userName: '',
        address: '',
        roles: [''],
        storeName: '',
        storeDescription: '',
        cbu: '',
    });

    const rolesDropdownRef = useRef<{ items: () => GetComboItemType[] | null } | null>(null);
    const rolesItems = useDropdownItems(rolesDropdownRef);

    const handleInputChange = (value: string, input: string) => {
        setForm((prevForm) => ({ ...prevForm, [input]: value }));
    };

    const handleSubmit = () => {
        if (loading) return;

        if (!form.email || !form.userName || !form.password || !form.address || form.roles.length === 0) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (isSellerSelected() && (!form.storeName || !form.storeDescription || !form.cbu)) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setLoading(true);

        // TODO: generic trim

        const rq: IRegisterRequest = {
            Email: form.email.trim(),
            Password: form.password.trim(),
            Username: form.userName.trim(),
            Address: form.address.trim(),
            Roles: form.roles,
            StoreName: form.storeName.trim(),
            StoreDescription: form.storeDescription.trim(),
            Cbu: form.cbu.trim(),
        };

        API.post<ITokenResponse, IRegisterRequest>('auth/register', rq)
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

    const handleLogin = (data: ITokenResponse) => {
        LocalStorage.setToken(data.token);
        LocalStorage.setUserId(data.user.id);
        LocalStorage.setUserRoles(data.user.roles);
        LocalStorage.setUserName(data.user.username);
        LocalStorage.setUserEmail(data.user.email);
        LocalStorage.setSessionExpiration(data.sessionExpiration);
        LocalStorage.setUserAddress(data.user.address);
    };

    const isSellerSelected = () => {
        return form.roles.includes(rolesItems?.find((x) => x.label === Roles.Seller)?.value || '');
    };

    return (
        <>
            <ToastContainer />
            <div className="d-flex login-container px-4">
                <Card className="shadow mx-auto my-auto card-container">
                    <h3 className="text-center mt-4">Crear usuario</h3>
                    <CardBody>
                        <Col xs={12}>
                            <Label required>Email</Label>
                            <Input
                                type="email"
                                required
                                value={form.email}
                                onChange={(value) => handleInputChange(value, 'email')}
                                submitOnEnter
                                onSubmit={handleSubmit}
                            />
                        </Col>
                        <Col xs={12} className="mt-3">
                            <Label required>Nombre de usuario</Label>
                            <Input
                                value={form.userName}
                                required
                                onChange={(value) => handleInputChange(value, 'userName')}
                                submitOnEnter
                                onSubmit={handleSubmit}
                            />
                        </Col>
                        <Col xs={12} className="mt-3">
                            <Label required>Dirección</Label>
                            <Input
                                type="address"
                                required
                                value={form.address}
                                onChange={(value) => handleInputChange(value, 'address')}
                                submitOnEnter
                                onSubmit={handleSubmit}
                            />
                        </Col>
                        <Col xs={12} className="mt-3 ">
                            <Label required>Contraseña</Label>
                            <Input
                                type="password"
                                required
                                value={form.password}
                                onChange={(value) => handleInputChange(value, 'password')}
                                submitOnEnter
                                onSubmit={handleSubmit}
                            />
                        </Col>
                        <Col xs={12} className="mt-3 pb-4">
                            <Label required>Desea ser</Label>
                            <RolesDropdown
                                value={form.roles}
                                exclude={[Roles.Admin]}
                                onChange={(value) => handleInputChange(value, 'roles')}
                                isMulti={true}
                                ref={rolesDropdownRef}
                            ></RolesDropdown>
                        </Col>
                        {isSellerSelected() && (
                            <>
                                <Col xs={12} className="pe-3 mb-3">
                                    <Label required>Nombre de su negocio</Label>
                                    <Input
                                        placeholder="Nombre de su negocio"
                                        value={form.storeName}
                                        onChange={(value) => handleInputChange(value, 'storeName')}
                                    />
                                </Col>
                                <Col xs={12} className="pe-3 mb-3">
                                    <Label required>Descripción de su negocio</Label>
                                    <Input
                                        placeholder="Descripción de su negocio"
                                        value={form.storeDescription}
                                        onChange={(value) => handleInputChange(value, 'storeDescription')}
                                    />
                                </Col>
                                <Col xs={12} className="pe-3 mb-3">
                                    <Label required>CBU</Label>
                                    <Input placeholder="CBU" type="number" value={form.cbu} onChange={(value) => handleInputChange(value, 'cbu')} />
                                </Col>
                            </>
                        )}
                        <Col xs={12} className="text-center">
                            <Link to="/login">Ya tiene cuenta? Inicia sesión</Link>
                        </Col>
                        <Col xs={12} className="d-flex mt-4">
                            <Button className="w-100" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader /> : 'REGISTRAR'}
                            </Button>
                        </Col>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default Register;
