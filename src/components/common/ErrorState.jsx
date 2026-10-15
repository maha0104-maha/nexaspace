import React from "react";

const ErrorState=({title="Something went wrong",message="Please try again.",onRetry})=>{
    return(
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)]">{message}</p>
            {onRetry&&(
                <button onClick={onRetry} className="text-[13px] font-medium text-[var(--color-primary)] hover:opacity-80">
                    Try again
                </button>
            )}
        </div>
    )
}

export default ErrorState;