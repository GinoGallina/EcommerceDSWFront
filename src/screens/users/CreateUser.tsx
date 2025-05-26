import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Label, Loader, RolesDropdown, Spinner, Toast } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import { ICreateUserRequest, ICreateUserResponse, IUserForm } from '../../interfaces/IUser/IUser';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { getBreadcrumbItems } from './Users.helpers';
import { GetComboItemType } from '../../interfaces/shared/IGetCombo';
import { Roles } from '../../app/constants/Roles';
import { useDropdownItems } from '../../hooks/useDropdownItems';
import App from '../../app/App';
import { LocalStorage } from '../../app/LocalStorage';
import { formatRole } from '../../app/Helpers';

const CreateUser = ({ isWatching = false, viewProfileDetails = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(InitialFormStates.User);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    const rolesDropdownRef = useRef<{ items: () => GetComboItemType[] | null } | null>(null);
    const rolesItems = useDropdownItems(rolesDropdownRef);

    // Get form data
    useEffect(() => {
        if (id) {
            API.get<IUserForm>('user/getOne/' + id, {}).then((r) => {
                setForm(() => ({
                    ...r.data,
                }));
                setLoading(false);
            });
        }
    }, [id, navigate, viewProfileDetails]);

    const handleSubmit = async () => {
        if (submitting) return;

        if (!form.username || !form.email || (!form.password && !id) || !form.address || form.roles.length === 0) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (isSellerSelected() && (!form.storeName || !form.storeDescription || !form.cbu)) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmitting(true);

        const rq: ICreateUserRequest = {
            Username: form.username,
            Email: form.email,
            Password: form.password,
            Address: form.address,
            Roles: form.roles,
            StoreName: form.storeName,
            StoreDescription: form.storeDescription,
            Cbu: form.cbu,
        };

        API.post<ICreateUserResponse, ICreateUserRequest>(`user/${id ? `update/${id}` : 'create'}`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                LocalStorage.setUserEmail(rq.Email);
                LocalStorage.setUserAddress(rq.Address);
                LocalStorage.setUserName(rq.Username);
                if (App.isAdmin()) navigate('/usuarios/list');
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleInputChange = (value: string, field: string) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    const isSellerSelected = () => {
        return form.roles.includes(rolesItems?.find((x) => x.label === formatRole(Roles.Seller))?.value || '');
    };

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? (isWatching ? 'Ver' : 'Editar') : 'Nuevo')} title="Usuarios" />
            <div>
                <Col xs={11} className="container">
                    <Card
                        title="Usuario"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row className="align-items-center">
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required={!isWatching || !viewProfileDetails}>Nombre de usuario</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Nombre de usuario"
                                                value={form.username}
                                                onChange={(value) => handleInputChange(value, 'username')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required={!isWatching || !viewProfileDetails}>Email</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Email"
                                                value={form.email}
                                                onChange={(value) => handleInputChange(value, 'email')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required={!isWatching || !viewProfileDetails}>Dirección</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Dirección"
                                                value={form.address}
                                                onChange={(value) => handleInputChange(value, 'address')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required={!isWatching || !viewProfileDetails}>Rol</Label>
                                            <RolesDropdown
                                                disabled={isWatching || viewProfileDetails}
                                                isMulti={true}
                                                placeholder="Seleccione uno o más roles"
                                                required
                                                value={form.roles}
                                                onChange={(value) => handleInputChange(value as string, 'roles')}
                                                ref={rolesDropdownRef}
                                            />
                                        </Col>
                                        {!viewProfileDetails && !id && (
                                            <Col xs={12} md={4} className="pe-3 mb-3">
                                                <Label
                                                    helpText="La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial"
                                                    required={!isWatching}
                                                >
                                                    Contraseña
                                                </Label>
                                                <Input
                                                    disabled={isWatching}
                                                    placeholder="Contraseña"
                                                    type="password"
                                                    value={form.password}
                                                    onChange={(value) => handleInputChange(value, 'password')}
                                                />
                                            </Col>
                                        )}
                                        {isSellerSelected() && (
                                            <>
                                                <Col xs={12} md={4} className="pe-3 mb-3">
                                                    <Label required={!isWatching || !viewProfileDetails}>Nombre de su negocio</Label>
                                                    <Input
                                                        disabled={isWatching}
                                                        placeholder="Nombre de su negocio"
                                                        value={form.storeName}
                                                        onChange={(value) => handleInputChange(value, 'storeName')}
                                                    />
                                                </Col>
                                                <Col xs={12} md={4} className="pe-3 mb-3">
                                                    <Label required={!isWatching || !viewProfileDetails}>Descripción de su negocio</Label>
                                                    <Input
                                                        disabled={isWatching}
                                                        placeholder="Descripción de su negocio"
                                                        value={form.storeDescription}
                                                        maxLength={200}
                                                        onChange={(value) => handleInputChange(value, 'storeDescription')}
                                                    />
                                                </Col>
                                                <Col xs={12} md={4} className="pe-3 mb-3">
                                                    <Label required={!isWatching || !viewProfileDetails}>CBU</Label>
                                                    <Input
                                                        disabled={isWatching}
                                                        placeholder="CBU"
                                                        type="number"
                                                        value={form.cbu}
                                                        onChange={(value) => handleInputChange(value, 'cbu')}
                                                    />
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            !isWatching && (
                                <div className="d-flex justify-content-end">
                                    <Button onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? <Loader /> : id ? 'Actualizar' : 'Enviar'}
                                    </Button>
                                </div>
                            )
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default CreateUser;
