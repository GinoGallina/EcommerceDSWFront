import { Col } from 'react-bootstrap';
import { BreadCrumb, Dropdown } from '../../components';

const Home = () => {
    return (
        <>
            <BreadCrumb title="Inicio" />
            <Col xs={12} className="container-fluid px-5">
                <p>HolaAAAAA</p>
                <p>HolaAAAAAddsad</p>
                <Dropdown
                    items={[
                        { value: '1', label: 'a' },
                        { value: '2', label: 'b' },
                    ]}
                ></Dropdown>
            </Col>
        </>
    );
};

export default Home;
