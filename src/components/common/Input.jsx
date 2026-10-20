const Input=({label,error,helperText,className="",id,type="text",...props})=>{
    const inputId=id||props.name;

    return(
        <div className="w-full">
            {label&&(
                <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-primary)]">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={`h-9 w-full rounded-lg border bg-[var(--color-surface)] px-3 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 disabled:cursor-not-allowed disabled:bg-[var(--color-background)] ${error?"border-[var(--color-danger)]":"border-[var(--color-border)]"} ${className}`}
                aria-invalid={!!error}
                aria-describedby={error||helperText?`${inputId}-message`:undefined}
                {...props}
            />
            {(error||helperText)&&(
                <p id={`${inputId}-message`} className={`mt-1.5 text-xs ${error?"text-[var(--color-danger)]":"text-[var(--color-text-secondary)]"}`}>
                    {error||helperText}
                </p>
            )}
        </div>
    )
}

export default Input;