import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, CategoryDropdown, Input, Label, Loader, Spinner, UserDropdown } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { getBreadcrumbItemsCreateProduct } from '../products/Products.helpers';
import { IProductForm } from '../../interfaces';
import App from '../../app/App';
import { LocalStorage } from '../../app/LocalStorage';
import { ICreateProductRequest, ICreateProductResponse } from '../../interfaces/IProduct/IProduct';
import { trimStrings } from '../../app/Helpers';

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

    useEffect(() => {
        if (!App.isAdmin() && form.userId && form.userId !== LocalStorage.getUserId()) navigate('/');
    }, [form.userId, navigate]);

    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        if (!form.name || !form.description || !form.price || !form.stock || !form.categoryId || (App.isAdmin() && !form.userId)) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (!form.userId && App.isAdmin()) {
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

        const rq: ICreateProductRequest = trimStrings({
            Name: form.name,
            Description: form.description,
            Stock: form.stock,
            Price: form.price,
            Image: form.image,
            CategoryId: form.categoryId,
            UserId: App.isSeller() ? LocalStorage.getUserId() : form.userId,
        });

        if (id) {
            rq.Id = id;
        }

        API.post<ICreateProductResponse, ICreateProductRequest>(`product/${id ? `update/${id}` : 'create'}`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                navigate('/misProductos/list');
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
            <BreadCrumb items={getBreadcrumbItemsCreateProduct(id ? (isWatching ? 'Ver' : 'Editar') : 'Nuevo')} title="Mis productos" />
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
                                            <Label helpText="Máxima longitud: 40 carácteres" helpPlacement="right" required>
                                                Nombre
                                            </Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Nombre"
                                                value={form.name}
                                                maxLength={40}
                                                onChange={(value) => handleInputChange(value, 'name')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label helpText="Máxima longitud: 255 carácteres" helpPlacement="right" required>
                                                Descripción
                                            </Label>
                                            <Input
                                                tag={form.description.length > 40 ? 'textarea' : 'input'}
                                                disabled={isWatching}
                                                placeholder="Descripción"
                                                value={form.description}
                                                maxLength={255}
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
                                                placeholder="Ingrese la cantidad de stock"
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
                                                    handleInputChange(value as string, 'categoryId');
                                                }}
                                            />
                                        </Col>
                                        {App.isAdmin() && (
                                            <Col xs={12} md={4} className="pe-3 mb-3">
                                                <Label required>Usuario</Label>
                                                <UserDropdown
                                                    value={form.userId}
                                                    disabled={isWatching}
                                                    isMulti={false}
                                                    onChange={(value) => {
                                                        handleInputChange(value as string, 'userId');
                                                    }}
                                                />
                                            </Col>
                                        )}
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label helpText="Ingrese la URL de la imagen que desee utilizar.">Imagen</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Imagen"
                                                value={form.image}
                                                maxLength={250}
                                                onChange={(value) => handleInputChange(value, 'image')}
                                            />
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
                    {isWatching && <div className="p-4 border rounded-4 shadow-sm bg-white"></div>}
                </Col>
            </div>
        </>
    );
};

export default CreateProduct;
