import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, CategoryDropdown, Input, Label, Loader, Spinner, UserDropdown } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { getBreadcrumbItems } from '../products/Products.helpers';
import { IProductForm } from '../../interfaces';
import App from '../../app/App';
import { LocalStorage } from '../../app/LocalStorage';
import { ICreateProductRequest, ICreateProductResponse } from '../../interfaces/IProduct/IProduct';

const CreateProduct = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialFormStates.Product);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    // Effects
    useEffect(() => {
        if (id) {
            API.get<IProductForm>('product/getOne/' + id, {}).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        //ver stock y price
        // TODO user
        if (!form.name || !form.description || !form.price || !form.stock || !form.categoryId) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (Number(form.price) < 0) {
            Toast.warning(Messages.Validation.graterThanZero('precio'));
            return;
        }

        if (Number(form.stock) < 0) {
            Toast.warning(Messages.Validation.graterThanZero('stock'));
            return;
        }

        setSubmiting(true);

        const rq: ICreateProductRequest = {
            Name: form.name,
            Description: form.description,
            Stock: form.stock,
            Price: form.price,
            Image: form.image,
            CategoryId: form.categoryId,
            UserId: App.isSeller() ? LocalStorage.getUserId() : form.userId,
        };

        if (id) {
            rq.Id = id;
        }

        API.post<ICreateProductResponse, ICreateProductRequest>(`product/${id ? 'update' : 'create'}`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                navigate('/misProductos/list');
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmiting(false);
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

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? (isWatching ? 'Ver' : 'Editar') : 'Nuevo')} title="Mis productos" />
            <div>
                <Col xs={11} className="container">
                    <Card
                        title="Producto"
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row className="align-items-center">
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Nombre</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Nombre"
                                                value={form.name}
                                                onChange={(value) => handleInputChange(value, 'name')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Descripción</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Descripción"
                                                value={form.description}
                                                onChange={(value) => handleInputChange(value, 'description')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Precio</Label>
                                            <Input
                                                disabled={isWatching}
                                                isFloat
                                                placeholder="Precio"
                                                type="number"
                                                value={form.price}
                                                onChange={(value) => handleInputChange(value, 'price')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Stock</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Stock"
                                                type="number"
                                                value={form.stock}
                                                onChange={(value) => handleInputChange(value, 'stock')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Categoria</Label>
                                            <CategoryDropdown
                                                value={form.categoryId}
                                                disabled={isWatching}
                                                isMulti={false}
                                                onChange={(value) => {
                                                    handleInputChange(value, 'categoryId');
                                                }}
                                            ></CategoryDropdown>
                                        </Col>
                                        {App.isAdmin() && (
                                            <Col xs={12} md={4} className="pe-3 mb-3">
                                                <Label required>Usuario</Label>
                                                <UserDropdown
                                                    value={form.userId}
                                                    disabled={isWatching}
                                                    isMulti={false}
                                                    onChange={(value) => {
                                                        handleInputChange(value, 'userId');
                                                    }}
                                                ></UserDropdown>
                                            </Col>
                                        )}
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label>Imagen</Label>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" className="me-2" onClick={() => navigate('/misProductos/list')}>
                                    Volver
                                </Button>
                                {!isWatching && (
                                    <Button onClick={handleSubmit} disabled={submiting}>
                                        {submiting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                    </Button>
                                )}
                            </div>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default CreateProduct;
