import {React,useEffect} from "react";

const Modal=({isOpen,onClose,title,children,footer,className=""})=>{
    useEffect(()=>{
        if(!isOpen)return;
        const handleKeyDown=(e)=>e.key==="Escape"&&onClose?.();
        window.addEventListener("keydown",handleKeyDown);
        return()=>window.removeEventListener("keydown",handleKeyDown);
    },[isOpen,onClose]);

    if(!isOpen)return null;

    return(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <button type="button" aria-label="Close modal" className="absolute inset-0 bg-black/30" onClick={onClose}/>
            <div role="dialog" aria-modal="true" aria-label={title||"Dialog"} className={`relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl ${className}`}>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
                    <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-background)]">✕</button>
                </div>
                <div className="p-5">{children}</div>
                {footer&&(
                    <div className="flex justify-end gap-2 border-t border-[var(--color-border)] px-5 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal;