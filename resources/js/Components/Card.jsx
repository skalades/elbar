import React from 'react';

export default function Card({ children, className = '', onClick, ...props }) {
    return (
        <div 
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

Card.Body = function CardBody({ children, className = '' }) {
    return <div className={`p-5 ${className}`}>{children}</div>;
};

Card.Header = function CardHeader({ children, className = '' }) {
    return <div className={`px-5 py-4 border-b border-gray-100 font-semibold text-gray-800 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
    return <div className={`px-5 py-4 border-t border-gray-100 bg-gray-50 ${className}`}>{children}</div>;
};
