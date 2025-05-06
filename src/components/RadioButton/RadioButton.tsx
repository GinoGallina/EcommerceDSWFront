import { ReactNode } from 'react';
import './radioButton.scss';

interface IRadioButtonProps {
    value: string;
    name: string;
    isDefault?: boolean;
    children: ReactNode;
    onChange: (value: string) => void;
}

const RadioButton: React.FC<IRadioButtonProps> = ({ value, name, children, isDefault = false, onChange = () => {} }) => {
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="radio"
                name={name}
                id={value}
                value={value}
                defaultChecked={isDefault}
                onChange={(v) => onChange(v.target.value)}
            />
            <label className="form-check-label" htmlFor={value}>
                {children}
            </label>
        </div>
    );
};

export default RadioButton;
