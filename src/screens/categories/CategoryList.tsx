import { Col, Row } from 'react-bootstrap';
import {
    // ActionButtons,
    BreadCrumb,
    Button,
    Card,
    Input,
    Table,
    TableSort,
    Toast,
} from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
import App from '../../app/App';
import API from '../../app/API';
import { buildGenericGetAllRq } from '../../app/Helpers';
import {
    CategoryListInterface,
    CategoryResponseInterface,
} from '../../interfaces/Category/CategoryInterfaces';
import { SortRequestInterface } from '../../interfaces';
import { columns, sortCategoryItems } from './Categroy.data';

const CategoryList = () => {
    const navigate = useNavigate();

    const categoryColumns = [
        ...columns,
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity="producto" {...props} />,
            className: 'text-center',
        },
    ];

    // States
    const [categories, setCategories] = useState<CategoryListInterface[]>([]);
    // const [prodFilter, setProdFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    // const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<SortRequestInterface | null>(null);

    const categoriesBreadCrums = [
        {
            label: 'Categorias',
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        const rq = buildGenericGetAllRq(currentPage, sort);

        API.post<CategoryResponseInterface>('categories/getAll', rq).then((r) => {
            const categories = r.data.categories.map((x) => {
                return {
                    ...x,
                    endpoint: 'category',
                };
            });
            setCategories(categories);
            setTotalCount(r.data.totalCount);
            if (categories.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

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

    const handleFilterCategories = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }: SortRequestInterface) => {
        setSort({ column, direction });
    };

    const updateDeletedRow = (id: string) => {
        setCategories((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    // Render
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    // const products = [
    //     {
    //         Id: 1,
    //         name: 'Producto 1',
    //         description:
    //             'Producto uno desc alalalalalalaladsdasdsadoducto uno desc alalalalalalaladsdasdoducto uno desc alalalalalalaladsdasdoducto uno desc alalalalalalaladsdasdoducto uno desc alalalalalalaladsdasdlalla',
    //         price: 1500,
    //         Stock: 25,
    //         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxi2bLyX7ULwIO9EDxmwZqLlng8TBmUKPPg&s',
    //         CategoryId: 1,
    //         SellerId: '2ce2a6b1-de39-4ce7-aea0-97794d5bd764',
    //         CreatedAt: '2025-02-17T19:45:25.575-03:00',
    //         UpdatedAt: null,
    //         DeletedAt: null,
    //     },
    //     {
    //         Id: 2,
    //         name: 'Producto 2',
    //         description: 'Producto dos desc bla bla bla',
    //         price: 2500,
    //         Stock: 30,
    //         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxi2bLyX7ULwIO9EDxmwZqLlng8TBmUKPPg&s',
    //         CategoryId: 2,
    //         SellerId: '3f0ac0a7-8e42-4707-bc0f-9b376ca5b8ea',
    //         CreatedAt: '2025-02-18T10:30:15.000-03:00',
    //         UpdatedAt: null,
    //         DeletedAt: null,
    //     },
    //     {
    //         Id: 3,
    //         name: 'Producto 3',
    //         description: 'Descripción del producto tres',
    //         price: 3000,
    //         Stock: 15,
    //         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnw-Co_WOv5LhTsrwfvQ2wn2Y8qmqq6VmIA&s',
    //         CategoryId: 3,
    //         SellerId: '7de8d8b7-c8a0-4d9a-a56e-155ff8767464',
    //         CreatedAt: '2025-02-19T11:00:05.000-03:00',
    //         UpdatedAt: null,
    //         DeletedAt: null,
    //     },
    // ];

    return (
        <>
            <BreadCrumb items={categoriesBreadCrums} title="Productos" />
            {/* {App.isSeller() && ( */}
            <Row className="mx-0 px-4 d-flex justify-content-center align-items-center">
                <Col className="text-end mt-4">
                    <Button onClick={() => navigate('/categorias/nuevo')}>Agregar categroia</Button>
                </Col>
            </Row>

            {/* )} */}
            <Col xs={11} className="container">
                <Card
                    title="Productos"
                    body={
                        <>
                            <Row>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <TableSort
                                        items={sortCategoryItems}
                                        onChange={handleSortChange}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="pe-3 mb-3">
                                    <Input
                                        showIcon
                                        borderless
                                        placeholder="Buscar"
                                        value={nameFilter}
                                        onChange={handleFilterCategories}
                                    />
                                </Col>
                            </Row>
                            <Table
                                className="mb-5"
                                columns={categoryColumns}
                                rows={categories.filter((x) =>
                                    x.name.toLowerCase().includes(nameFilter.toLowerCase())
                                )}
                                emptyTableMessage="No se encontraron categorias"
                                pagination={true}
                                currentPage={currentPage}
                                totalCount={totalCount}
                                onPageChange={handlePageChange}
                                onUpdate={updateDeletedRow}
                            />
                        </>
                    }
                    footer={
                        <div className="d-flex justify-content-end">
                            <Button onClick={() => navigate('/categorias/new')} variant="primary">
                                Nueva categoria
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default CategoryList;
