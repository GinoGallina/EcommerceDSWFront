import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, RolesDropdown, Table, TableSort, Toast } from '../../components';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../app/constants/Messages';
import API from '../../app/API';
import { buildGenericGetAllRq } from '../../app/Helpers';
import { ColumnComponentType, IColumn } from '../../interfaces/shared/ITable';
import { ISortRequest } from '../../interfaces';
import { IGetAllUserRequest, IGetAllUserResponse, IUserList } from '../../interfaces/IUser/IUser';
import { columns, sortUserItems } from './Users.data';
import { useDebounce } from '../../hooks/useDebounce';

const UserList = () => {
    const navigate = useNavigate();

    const userColumns: IColumn<IUserList>[] = [
        ...columns,
        {
            name: '',
            text: 'Acciones',
            component: (props: ColumnComponentType<IUserList>) => <ActionButtons {...props} entity="usuario" />,
            className: 'text-center',
        },
    ];

    // States
    const [users, setUsers] = useState<IUserList[]>([]);

    const rolesDropdownRef = useRef(null);

    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState<ISortRequest | null>(null);
    const debouncedText = useDebounce(nameFilter, 300);

    const usersBreadCrums = [
        {
            label: 'Usuarios',
            active: true as const,
        },
    ];

    // Effects
    useEffect(() => {
        const rq: IGetAllUserRequest = {
            ...buildGenericGetAllRq(currentPage, sort),
            roles: roleFilter,
            text: debouncedText,
        };

        API.get<IGetAllUserResponse>('user/getAll', rq).then((r) => {
            const users = r.data.users.map((x) => {
                return {
                    ...x,
                    endpoint: 'user',
                };
            });
            setUsers(users);
            setTotalCount(r.data.totalCount);
            if (users.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, debouncedText, roleFilter, sort]);

    // Handlers
    const handleFilterusers = (value: string) => {
        setNameFilter(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }: ISortRequest) => {
        setSort({ column, direction });
    };

    const handleRoleChange = (value: string[]) => {
        setRoleFilter(value);
    };

    const updateDeletedRow = (id: string) => {
        setUsers((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={usersBreadCrums} title="Usuarios" />
            <Col xs={11} className="container">
                <Card
                    title="Usuarios"
                    body={
                        <>
                            <Row>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <TableSort items={sortUserItems} onChange={handleSortChange} />
                                </Col>
                                <Col xs={12} sm={6} lg={3} className="mb-3">
                                    <RolesDropdown
                                        isMulti
                                        value={roleFilter}
                                        useDefaultDisableOption={false}
                                        onChange={(v) => handleRoleChange(v as string[])}
                                        ref={rolesDropdownRef}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 pe-3">
                                    <Input showIcon borderless placeholder="Buscar" value={nameFilter} onChange={handleFilterusers} />
                                </Col>
                            </Row>
                            <Table<IUserList>
                                className="mb-5"
                                columns={userColumns}
                                rows={users}
                                emptyTableMessage="No se encontraron usuarios"
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
                            <Button onClick={() => navigate('/usuarios/new')} variant="primary">
                                Nuevo usuario
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default UserList;
