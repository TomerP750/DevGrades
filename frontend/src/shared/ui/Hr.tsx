interface HrProps {
    className?: string;
}
export function Hr({ className }: HrProps) {
    return <hr className={`h-px border-t border-border ${className} `} />;
}