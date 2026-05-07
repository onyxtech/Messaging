import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface FormInputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  icon?: React.ElementType | null;
  rightIcon?: React.ElementType | null;
  onRightIconClick?: () => void;
  helperText?: string;
}

export function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  readOnly = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  helperText,
}: FormInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <motion.div 
      className="space-y-1.5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none z-10">
            <Icon className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
          </div>
        )}
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${RightIcon ? 'pr-10' : 'pr-4'} py-2.5 rounded-lg border transition-all duration-200
            ${readOnly ? 'bg-gray-100 cursor-not-allowed text-gray-600' : 'bg-white hover:border-gray-300'}
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            } focus:outline-none shadow-sm hover:shadow-md transition-shadow placeholder-gray-400`}
          style={{ color: readOnly ? '#4B5563' : '#111827' }}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {helperText && !error && <p className="text-gray-400 text-xs">{helperText}</p>}
      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-500 text-xs flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error.message as string}
        </motion.p>
      )}
    </motion.div>
  );
}