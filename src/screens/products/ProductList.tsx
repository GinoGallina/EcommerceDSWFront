import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, CategoryDropdown, CheckBox, Input, Pagination, RadioButton, TableSort } from '../../components';
import { useEffect, useState } from 'react';
import { sortProductListItems } from './Products.data';
import { buildGenericGetAllRq } from '../../app/Helpers';
import API from '../../app/API';
import { ISortRequest } from '../../interfaces';
import { IProductList, IProductListGetAllRequest, IProductListGetAllResponse } from '../../interfaces/IProduct/IProduct';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useDebounce } from '../../hooks/useDebounce';
import { useOrder } from '../../contexts/OrderContext';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const navigate = useNavigate();

    // States
    const [products, setProducts] = useState<IProductList[]>([]);
    const { orderItems, addToOrder, removeFromOrder } = useOrder();

    // Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);
    const [filters, setFilters] = useState<{
        category: string[];
        text: string;
        stockAvailable: boolean;
        priceOption: string;
        price: string;
    }>({
        category: [],
        text: '',
        stockAvailable: true,
        price: '',
        priceOption: '',
    });

    const productsBreadCrums = [
        {
            label: 'Productos',
            active: true as const,
        },
    ];

    const debouncedText = useDebounce(filters.text, 300);

    // Effects
    useEffect(() => {
        const rq: IProductListGetAllRequest = {
            ...buildGenericGetAllRq(currentPage, sort, undefined, 20),
            available: filters.stockAvailable,
            categoryIds: filters.category,
            text: debouncedText,
            price: filters.price,
            priceOption: filters.priceOption,
        };

        API.get<IProductListGetAllResponse>('product/getAll', rq).then((r) => {
            const products = r.data.products.map((x) => {
                return {
                    ...x,
                    endpoint: 'product',
                };
            });
            setProducts(products);
            setTotalCount(r.data.totalCount);
        });
    }, [currentPage, filters.category, filters.stockAvailable, debouncedText, sort, filters.price, filters.priceOption]);

    // Handlers
    const handleSortChange = ({ column, direction }: ISortRequest) => {
        setSort({ column, direction });
    };

    const handleFiltersChange = (value: string | boolean, field: string) => {
        setFilters((prevFilters) => {
            return {
                ...prevFilters,
                [field]: value,
            };
        });
    };

    const handleAddToOrder = (productId: string) => {
        const product = products.find((x) => x.id === productId);
        if (product && !orderItems.some((x) => x.productId === productId)) {
            addToOrder({
                productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
            });
        }
    };

    const handleRemoveFromOrder = (productId: string) => {
        removeFromOrder(productId);
    };

    return (
        <>
            <BreadCrumb items={productsBreadCrums} title="Productos" />
            <Col xs={11} className="container-fluid p-0">
                <Col xs={12} className="mb-3">
                    <Row className="justify-content-end">
                        <Col xs={12} sm={6} lg={3} className="mb-3">
                            <TableSort items={sortProductListItems} onChange={handleSortChange} />
                        </Col>
                        <Col xs={12} className="">
                            <Input
                                showIcon
                                borderless
                                placeholder="Buscar por nombre o descripción"
                                value={filters.text}
                                onChange={(v) => handleFiltersChange(v, 'text')}
                            />
                        </Col>
                    </Row>
                </Col>
                <Row className="justify-content-center">
                    <Col xs={12} md={2}>
                        <Row>
                            <Col xs={12} className="mb-3">
                                <CategoryDropdown
                                    value={filters.category}
                                    isMulti={true}
                                    onChange={(v) => handleFiltersChange(v as string, 'category')}
                                />
                            </Col>
                            <hr />
                            <Col xs={12} className="mb-3">
                                <CheckBox
                                    label="Mostrar solo disponibles"
                                    checked={filters.stockAvailable}
                                    onChange={(v) => handleFiltersChange(v, 'stockAvailable')}
                                />
                            </Col>
                            <hr />
                            <Col xs={12} className="">
                                <Input
                                    borderless
                                    type="number"
                                    isFloat
                                    placeholder="Filtrar por precio"
                                    value={filters.price}
                                    minValue={0}
                                    className="mb-2"
                                    onChange={(v) => handleFiltersChange(v, 'price')}
                                />
                                <RadioButton value="lte" name="condition" onChange={(v) => handleFiltersChange(v, 'priceOption')}>
                                    Menor o igual a
                                </RadioButton>
                                <RadioButton value="gte" name="condition" onChange={(v) => handleFiltersChange(v, 'priceOption')}>
                                    Mayor o igual a
                                </RadioButton>
                                <RadioButton value="eq" name="condition" onChange={(v) => handleFiltersChange(v, 'priceOption')}>
                                    Exactamente
                                </RadioButton>
                                <RadioButton value="empty" name="condition" isDefault onChange={(v) => handleFiltersChange(v, 'priceOption')}>
                                    Ninguno
                                </RadioButton>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={10}>
                        <Row>
                            {products.map((product, idx) => (
                                <Col key={idx} xs={10} sm={6} md={4} lg={3} className="mb-3 mx-auto">
                                    <ProductCard
                                        {...product}
                                        categoryName={product.categoryName || ''}
                                        isInOrder={orderItems.some((item) => item.productId === product.id)}
                                        onAddToOrder={handleAddToOrder}
                                        onRemoveFromOrder={handleRemoveFromOrder}
                                        onViewDetails={() => {
                                            navigate('/productos/' + product.id);
                                        }}
                                    />
                                </Col>
                            ))}
                            <Col xs={12} className="d-flex justify-content-end mt-3">
                                <Pagination currentPage={currentPage} itemsPerPage={20} totalCount={totalCount} setCurrentPage={setCurrentPage} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default ProductList;
