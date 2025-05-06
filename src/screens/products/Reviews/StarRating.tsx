import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type StarRatingProps = {
    rate: number;
    totalReviews?: number;
    onChange: (rating: number) => void;
    max?: number;
    readOnly?: boolean;
};

export const StarRating: React.FC<StarRatingProps> = ({ rate, totalReviews = null, onChange, max = 5, readOnly = false }) => {
    return (
        <div className="d-flex align-items-center gap-1">
            <p className="mb-0">{rate}</p>
            {[...Array(max)].map((_, i) => {
                const value = i + 1;
                return (
                    <button
                        key={value}
                        type="button"
                        className="btn p-0 border-0 bg-transparent"
                        disabled={readOnly}
                        onClick={() => onChange(value)}
                        style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    >
                        <FontAwesomeIcon icon={faStar} color={value <= rate ? '#ffc107' : '#e4e5e9'} />
                    </button>
                );
            })}
            {totalReviews !== null && <p className="mb-0">({totalReviews})</p>}
        </div>
    );
};
