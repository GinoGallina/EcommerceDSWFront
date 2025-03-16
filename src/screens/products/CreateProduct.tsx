import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Label, Loader, Spinner } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../app/constants/Messages';
import { getBreadcrumbItems } from '../products/Products.helpers';
import { ProductFormInterface } from '../../interfaces';

const CreateProduct = ({ isWatching = false, isEditing = false }) => {
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
            API.get<ProductFormInterface>('product/getOneById', { id }).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
    }, [id]);

    // Handlers
    const handleSubmit = async () => {
        if (submiting) return;

        //ver stock y price
        if (
            !form.name ||
            !form.description ||
            !form.price ||
            !form.stock ||
            !form.image ||
            !form.categoryId
        ) {
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

        const rq: {
            id?: string;
            name: string;
            description: string;
            stock: string;
            price: string;
            image: string;
            categoryId: string;
        } = {
            name: form.name,
            description: form.description,
            stock: form.stock,
            price: form.price,
            image: form.image,
            categoryId: form.categoryId,
        };

        if (id) {
            rq.id = id;
        }

        API.post(`product/${id ? 'update' : 'create'}`, rq)
            .then((r) => {
                if (r.message) Toast.success(r.message);
                navigate('/productos/list');
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
        // saveProduct(
        //     form,
        //     id,
        //     () => {
        //         navigate('/productos/list');
        //     },
        //     () => {
        //         setSubmiting(false);
        //     }
        // );
    };

    const handleInputChange = (value: string, field: string) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    // if (!App.isSeller()) {
    //     return navigate('/notAllowed');
    // }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? 'Editar' : 'Nuevo')} title="Productos" />
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
                                                onChange={(value) =>
                                                    handleInputChange(value, 'name')
                                                }
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Descripción</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Descripción"
                                                value={form.name}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'description')
                                                }
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
                                                onChange={(value) =>
                                                    handleInputChange(value, 'price')
                                                }
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Stock</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Stock"
                                                type="number"
                                                value={form.price}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'stock')
                                                }
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Categoria</Label>
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Imagen</Label>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    onClick={() => navigate('/misProductos/list')}
                                >
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
