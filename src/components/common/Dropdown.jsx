import { cloneElement, useEffect, useRef, useState } from 'react';

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className = '',
  mode = 'select',
  trigger,
  children,
  menuClassName = '',
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open || mode !== 'menu') return;

    const handlePointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, mode]);

  // Menu Mode
  if (mode === 'menu') {
    const menuTrigger = cloneElement(trigger, {
      'aria-haspopup': 'menu',
      'aria-expanded': open,
      onClick: (event) => {
        trigger.props.onClick?.(event);
        setOpen((previous) => !previous);
      },
    });

    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        {menuTrigger}
        {open && (
          <div role="menu" className={menuClassName}>
            {typeof children === 'function'
              ? children({ close: () => setOpen(false) })
              : children}
          </div>
        )}
      </div>
    );
  }

  // Standard Select Mode
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={props.id || props.name} 
          className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      
      <select
        id={props.id || props.name}
        value={value}
        onChange={onChange}
        className={`h-9 w-full rounded-lg border bg-[var(--color-surface)] px-3 text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
          error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]'
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
