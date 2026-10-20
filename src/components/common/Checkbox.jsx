const Checkbox=({id,name,checked=false,onChange,label,description,disabled=false,className="",...props})=>{
    const inputId=id||name||`checkbox-${label?.toLowerCase().replace(/\s+/g,"-")}`;

    return(
        <div className={`flex items-start gap-2.5 ${className}`}>
            <input
                id={inputId}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--color-border)] accent-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed"
                {...props}/>
            {(label||description)&&(
                <div className="min-w-0">
                    {label&&(
                        <label htmlFor={inputId} className={`block text-[13px] ${disabled?"text-[var(--color-text-muted)]":"text-[var(--color-text-primary)]"} cursor-pointer`}>
                            {label}
                        </label>
                    )}
                    {description&&(
                        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Checkbox;