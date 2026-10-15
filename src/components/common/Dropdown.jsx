import React from "react";
const Dropdown=({label,options=[],value,onChange,placeholder="Select an option",error,className="",...props})=>{
    return(
        <div className={`w-full ${className}`}>
            {label&&(
                <label htmlFor={props.id||props.name} className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-primary)]">
                    {label}
                </label>
            )}
            <select
                id={props.id||props.name}
                value={value}
                onChange={onChange}
                className={`h-9 w-full rounded-lg border bg-[var(--color-surface)] px-3 text-[13px] text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${error?"border-[var(--color-danger)]":"border-[var(--color-border)]"}`}
                {...props}>
                <option value="">{placeholder}</option>
                {options.map((option)=>(
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error&&(
                <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>
            )}
        </div>
    )
}

export default Dropdown;