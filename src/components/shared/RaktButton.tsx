import { Button } from "@/components/ui/button";

interface RaktButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function RaktButton({ children, onClick, className = "", disabled }: RaktButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full font-bold text-base py-2 bg-rakta-red hover:bg-rakta-red-light text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </Button>
  );
}
