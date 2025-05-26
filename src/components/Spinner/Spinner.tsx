import './spinner.scss';

const Spinner = ({ black = true }) => {
    return (
        <div data-testid="spinner" className="spinner-container">
            <span className={`spinner ${black ? 'black' : 'white'}`}></span>
        </div>
    );
};

export default Spinner;
