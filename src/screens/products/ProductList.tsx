import { Col, Row } from 'react-bootstrap';
import {
    // ActionButtons,
    BreadCrumb,
    Button,
    // Card,
    Input,
    // ProductsDropdown,
    // Table,
    // TableSort,
    Toast,
} from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
import App from '../../app/App';
import { BreadCrumbItem } from '../../interfaces/shared/BreadCrumInterface';
import ProductCard from '../../components/ProductCard/ProductCard';
// import { clientCols, productCols, sortProductItems } from './Products.data';
// import { getAllProducts, getBreadcrumbItems, getClientProducts } from './Products.helpers';

const ProductList = () => {
    const navigate = useNavigate();

    // States
    // const [products, setProducts] = useState([]);
    // const [clients, setClients] = useState([]);
    // const [prodFilter, setProdFilter] = useState('');
    // const [clientFilter, setClientFilter] = useState('');
    // const [selectedProduct, setSelectedProduct] = useState(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalCount, setTotalCount] = useState(0);
    // const [sort, setSort] = useState(null);

    const productsBreadCrums = [
        {
            label: 'Productos',
            active: true as const,
        },
    ];

    // Effects
    // useEffect(() => {
    // getAllProducts(sort, currentPage, ({ products, totalCount }) => {
    //     setTotalCount(totalCount);
    //     setProducts(products);
    //     if (products.length === 0) {
    //         Toast.warning(Messages.Error.noRows);
    //     }
    // });
    // }, [currentPage, sort]);

    // useEffect(() => {
    // if (!selectedProduct) return;
    // getClientProducts(selectedProduct, (clients) => {
    //     setClients(clients);
    // });
    // }, [selectedProduct]);

    // Handlers
    // const handleFilterProducts = (value) => {
    //     setProdFilter(value);
    // };

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
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    const products = [
        {
            Id: 1,
            name: 'Producto 1',
            description:
                'Producto uno desc alalalalalalaladsdasdsadoducto uno desc alalalalalalaladsdasdoducto uno desc alalalalalalaladsdasdoducto uno desc alalalalalalaladsdasdoducto uno desc alalalalalalaladsdasdlalla',
            price: 1500,
            Stock: 25,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxi2bLyX7ULwIO9EDxmwZqLlng8TBmUKPPg&s',
            CategoryId: 1,
            SellerId: '2ce2a6b1-de39-4ce7-aea0-97794d5bd764',
            CreatedAt: '2025-02-17T19:45:25.575-03:00',
            UpdatedAt: null,
            DeletedAt: null,
        },
        {
            Id: 2,
            name: 'Producto 2',
            description: 'Producto dos desc bla bla bla',
            price: 2500,
            Stock: 30,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxi2bLyX7ULwIO9EDxmwZqLlng8TBmUKPPg&s',
            CategoryId: 2,
            SellerId: '3f0ac0a7-8e42-4707-bc0f-9b376ca5b8ea',
            CreatedAt: '2025-02-18T10:30:15.000-03:00',
            UpdatedAt: null,
            DeletedAt: null,
        },
        {
            Id: 3,
            name: 'Producto 3',
            description: 'Descripción del producto tres',
            price: 3000,
            Stock: 15,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnw-Co_WOv5LhTsrwfvQ2wn2Y8qmqq6VmIA&s',
            CategoryId: 3,
            SellerId: '7de8d8b7-c8a0-4d9a-a56e-155ff8767464',
            CreatedAt: '2025-02-19T11:00:05.000-03:00',
            UpdatedAt: null,
            DeletedAt: null,
        },
    ];

    return (
        <>
            <BreadCrumb items={productsBreadCrums} title="Productos" />
            {/* {App.isSeller() && ( */}
            <Row className="mx-0 px-4 d-flex justify-content-center align-items-center">
                <Col className="text-end mt-4">
                    <Button onClick={() => navigate('/misProductos/nuevo')}>
                        Agregar producto
                    </Button>
                </Col>
            </Row>

            {/* )} */}
            <Col xs={11} className="container">
                <Row>
                    {products.map((x, idx) => (
                        <Col xs={12} sm={6} md={4} lg={3} key={idx}>
                            <ProductCard {...x} />
                        </Col>
                    ))}
                </Row>
                {/* <Card
                        header={<h4>Productos asociados a clientes</h4>}
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className="mb-3">
                                        <ProductsDropdown
                                            value={selectedProduct}
                                            onChange={setSelectedProduct}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={4} className="pe-3 mb-3">
                                        <Input
                                            showIcon
                                            borderless
                                            placeholder="Nombre del cliente"
                                            value={clientFilter}
                                            onChange={handleFilterClients}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className="mb-5"
                                    columns={clientCols}
                                    rows={clients.filter((x) =>
                                        x.name.toLowerCase().includes(clientFilter)
                                    )}
                                    emptyTableMessage={
                                        selectedProduct &&
                                        'No se encontraron clientes asociados a este producto'
                                    }
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    onPageChange={handlePageChange}
                                    onUpdate={updateDeletedRow}
                                />
                            </>
                        }
                    />  */}
            </Col>
        </>
    );
};

export default ProductList;
