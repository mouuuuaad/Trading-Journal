
export const TradeVisionIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" stroke="none" />
        <path
            d="M9.5 12C9.5 13.3807 10.6193 14.5 12 14.5C13.3807 14.5 14.5 13.3807 14.5 12"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M16 9.25C16 8.00736 14.9926 7 13.75 7H10.25C9.00736 7 8 8.00736 8 9.25V9.5"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);
