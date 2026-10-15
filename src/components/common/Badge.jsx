import React from "react";
const Badge=({
  children,variant = "default",size = "md",className = ""})=>{
  const variants={
    default:"bg-[var(--color-background)] text-[var(--color-text-secondary)]",
    primary:"bg-[var(--color-primary-light)] text-[var(--color-primary)]",
    success:"bg-[var(--color-success-light)] text-[var(--color-success)]",
    warning:"bg-[var(--color-warning-light)] text-[var(--color-warning)]",
    danger:"bg-[var(--color-danger-light)] text-[var(--color-danger)]",
    info:"bg-[var(--color-info-light)] text-[var(--color-info)]",
  };
  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };
  return (
    <span className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ${variants[variant]||variants.default} ${sizes[size]||sizes.md} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;