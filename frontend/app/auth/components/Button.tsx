import { motion } from 'framer-motion';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  icon?: React.ElementType;
}

export function Button({
  type = 'button',
  onClick,
  disabled,
  isLoading,
  children,
  variant = 'primary',
  fullWidth = true,
  icon: Icon,
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${fullWidth ? 'w-full' : ''} ${variants[variant]} font-semibold py-3 rounded-lg transition-all disabled:opacity-50 hover:scale-[1.02] transform duration-200`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {children}
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </span>
      )}
    </motion.button>
  );
}