interface CustomCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function CustomCard({ children, onClick, className = "" }: CustomCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
