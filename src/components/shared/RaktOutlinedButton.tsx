interface RaktOutlinedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function RaktOutlinedButton({ children, onClick, className = "" }: RaktOutlinedButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full font-bold text-base py-2.5 border-2 border-rakta-red text-rakta-red rounded-xl hover:bg-red-50 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
