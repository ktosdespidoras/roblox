import React from 'react';

interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => (
  <div className={`glass-card rounded-3xl relative overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

interface ButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = "", disabled = false }) => {
  const baseStyle = "w-full py-4 px-8 rounded-2xl font-bold tracking-wide transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
  
  const variants = {
    primary: "bg-white text-black hover:bg-cyan-50 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

interface InputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange, className = "", icon }) => (
  <div className={`relative group ${className}`}>
    {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors duration-300">{icon}</div>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full input-field border border-transparent rounded-2xl py-4 ${icon ? 'pl-12' : 'px-5'} pr-5 text-white placeholder-white/20 focus:outline-none focus:bg-white/5 focus:border-white/10 transition-all duration-300`}
    />
  </div>
);

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className="" }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${className}`}>
    {children}
  </span>
);