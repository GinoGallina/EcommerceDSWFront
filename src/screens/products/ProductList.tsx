import { Col, Row } from 'react-bootstrap';
import {
    ActionButtons,
    // ActionButtons,
    BreadCrumb,
    Button,
    Card,
    CategoryDropdown,
    CheckBox,
    // Card,
    Input,
    Pagination,
    Table,
    TableSort,
    // ProductsDropdown,
    // Table,
    // TableSort,
    Toast,
} from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
// import App from '../../app/App';
// import { BreadCrumbItem } from '../../interfaces/shared/BreadCrumInterface';
// import ProductCard from '../../components/ProductCard/ProductCard';
import { productCols, sortProductItems, sortProductListItems } from './Products.data';
import { ColumnComponentType } from '../../interfaces/shared/ITable';
import { buildGenericGetAllRq } from '../../app/Helpers';
import API from '../../app/API';
import { ISortRequest } from '../../interfaces';
import { IProductList, IProductListGetAllRequest, IProductResponse } from '../../interfaces/IProduct/IProduct';
import ProductCard from '../../components/ProductCard/ProductCard';
import { LocalStorage } from '../../app/LocalStorage';
// import { clientCols, productCols, sortProductItems } from './Products.data';
// import { getAllProducts, getBreadcrumbItems, getClientProducts } from './Products.helpers';
const ProductList = () => {
    const navigate = useNavigate();

    // const [clients, setClients] = useState([]);
    // const [prodFilter, setProdFilter] = useState('');
    // const [clientFilter, setClientFilter] = useState('');
    // const [selectedProduct, setSelectedProduct] = useState(null);

    // States
    const [products, setProducts] = useState<IProductList[]>([]);

    // Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);
    const [currentCart, setCurrentCart] = useState(LocalStorage.getCartItems());
    const [filters, setFilters] = useState<{
        category: string[];
        text: string;
        stockAvailable: boolean;
    }>({
        category: [],
        text: '',
        stockAvailable: true,
    });

    const productsBreadCrums = [
        {
            label: 'Productos',
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        const rq: IProductListGetAllRequest = buildGenericGetAllRq(currentPage, sort, undefined, 20);

        rq.available = filters.stockAvailable;
        rq.categoryIds = filters.category;

        API.get<IProductResponse>('product/getAll', rq).then((r) => {
            const products = r.data.products.map((x) => {
                return {
                    ...x,
                    endpoint: 'product',
                };
            });
            setProducts(products);
            setTotalCount(r.data.totalCount);
            if (products.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, filters.category, filters.stockAvailable, sort]);

    // Handlers

    // const handleFilterClients = (value) => {
    //     setClientFilter(value);
    // };

    // const handlePageChange = (page) => {
    //     setCurrentPage(page);
    // };

    // const handleSortChange = ({ column, direction }) => {
    //     setSort({ column, direction });
    // };

    // const updateDeletedRow = (id) => {
    //     setProducts((prevRow) => prevRow.filter((row) => row.id !== id));
    // };

    // Render
    // if (!App.isAdmin()) {
    //     return navigate('/notAllowed');
    // }

    // Handlers
    const handleFilterProducts = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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

    const handleAddToCart = (productId: string) => {
        const product = products.find((x) => x.id === productId);
        if (product) {
            if (!currentCart.some((x) => x.productId === productId)) {
                const newCart = [
                    ...currentCart,
                    {
                        productId,
                        name: product?.name,
                        price: product?.price,
                        quantity: 1,
                        image: product?.image,
                    },
                ];
                LocalStorage.setCartItems(newCart);
                setCurrentCart(newCart);
            }
        }
    };

    const handleRemoveFromCart = (productId: string) => {
        const newCart = currentCart.filter((x) => x.productId !== productId);
        LocalStorage.setCartItems(newCart);
        setCurrentCart(newCart);
    };

    // console.log(currentCart);

    return (
        <>
            <BreadCrumb items={productsBreadCrums} title="Productos" />
            <Col xs={11} className="container-fluid">
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
                            <Col xs={12} className="mb-2">
                                <CategoryDropdown
                                    value={filters.category}
                                    isMulti={true}
                                    onChange={(v) => handleFiltersChange(v, 'category')}
                                ></CategoryDropdown>
                            </Col>
                            <Col xs={12}>
                                <CheckBox
                                    label="Mostrar unicamente disponibles"
                                    checked={filters.stockAvailable}
                                    onChange={(v) => handleFiltersChange(v, 'stockAvailable')}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={10}>
                        <Row>
                            {products
                                .filter(
                                    (x) =>
                                        !filters.text ||
                                        x.description.toLowerCase().includes(filters.text.toLowerCase()) ||
                                        x.name.toLowerCase().includes(filters.text.toLowerCase())
                                )
                                .filter((x) => filters.category.length === 0 || filters.category.includes(x.categoryId))
                                .map((x, idx) => (
                                    <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={idx}>
                                        <ProductCard
                                            {...x}
                                            isInCart={currentCart.some((item) => item.productId === x.id)}
                                            onAddToCart={handleAddToCart}
                                            onRemoveFromCart={handleRemoveFromCart}
                                        />
                                    </Col>
                                ))}
                            <Col xs={12} className="d-flex justify-content-end mt-3">
                                <Pagination
                                    currentPage={currentPage}
                                    itemsPerPage={20}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                ></Pagination>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default ProductList;
