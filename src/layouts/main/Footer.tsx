import { JSX } from 'react';
import './footer.scss';

const Footer = (): JSX.Element => {
    return (
        <div className="custom-footer shadow">
            <footer>
                <span className="mx-auto">Ecommerce &copy; - {new Date().getFullYear()}</span>
            </footer>
        </div>
    );
};

export default Footer;
