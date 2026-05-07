'use client';

import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from './Button';

interface MessageCardProps {
  image?: string | StaticImageData;
  subject: string;
  message: string;
  onClickBtn?: () => void;
  btnText?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function MessageCard({
  image,
  subject,
  message,
  onClickBtn,
  btnText = 'Continue',
  variant = 'success',
  showCloseButton = true,
  onClose,
}: MessageCardProps) {
  const variants = {
    success: {
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
    },
    error: {
      icon: XCircle,
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
    },
    warning: {
      icon: AlertCircle,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
    },
    info: {
      icon: Info,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
    },
  };

  const currentVariant = variants[variant];
  const IconComponent = currentVariant.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative w-full max-w-md overflow-hidden"
    >
      {/* Gradient Top Bar */}
      <div className={`h-1 bg-gradient-to-r ${currentVariant.gradient}`} />

      <div className={`bg-white rounded-2xl shadow-2xl border ${currentVariant.borderColor}`}>
        <div className="p-6">
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Icon/Image Section */}
          <div className="flex justify-center mb-4">
            {image ? (
              <div className="relative w-20 h-20">
                <Image
                  src={image}
                  alt={subject}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentVariant.bgGradient} flex items-center justify-center`}>
                <IconComponent className={`w-10 h-10 ${currentVariant.textColor}`} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h3 className={`text-xl font-bold ${currentVariant.textColor}`}>
              {subject}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Button */}
          {onClickBtn && (
            <div className="mt-6">
              <Button
                onClick={onClickBtn}
                variant={variant === 'error' ? 'danger' : 'primary'}
                fullWidth
              >
                {btnText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}