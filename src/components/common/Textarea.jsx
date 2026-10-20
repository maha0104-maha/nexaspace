const Textarea=({label,error,helperText,className="",id,...props})=>{
    const textareaId=id||props.name;

    return(
        <div className="w-full">
            {label&&(
                <label htmlFor={textareaId} className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-primary)]">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                rows={4}
                className={`w-full resize-y rounded-lg border bg-[var(--color-surface)] px-3 py-2.5 text-[13px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${error?"border-[var(--color-danger)]":"border-[var(--color-border)]"} ${className}`}
                aria-invalid={!!error}
                aria-describedby={error||helperText?`${textareaId}-message`:undefined}
                {...props}
            />
            {(error||helperText)&&(
                <p id={`${textareaId}-message`} className={`mt-1.5 text-xs ${error?"text-[var(--color-danger)]":"text-[var(--color-text-secondary)]"}`}>
                    {error||helperText}
                </p>
            )}
        </div>
    )
}

export default Textarea;