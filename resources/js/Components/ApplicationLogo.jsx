export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 60"
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="32"
                fontWeight="900"
                fill="currentColor"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="2"
            >
                ELBAR
            </text>
            <text
                x="50%"
                y="85%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="currentColor"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="4"
                className="opacity-70"
            >
                CAR WASH
            </text>
        </svg>
    );
}

