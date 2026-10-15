import React from "react";
const Card=({title,description,action,children,footer,className = "",headerClassName = "",
  contentClassName = "",
})=>{
  const showHeader=title||description||action;
  return (
    <section className={`rounded-xl border border-[#e7e8ec] bg-white shadow-[0_1px_2px_rgba(16,19,35,0.04)] ${className}`}>
      {showHeader&&(
        <div
          className={`flex items-start justify-between gap-4 border-b border-[#e7e8ec] px-5 py-4 ${headerClassName}`}>
          <div className="min-w-0">
            {title&&(
              <h2 className="text-sm font-semibold text-[#101323]">
                {title}
              </h2>
            )}

            {description&&(
              <p className="mt-1 text-xs text-[#626779]">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${contentClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-[#e7e8ec] px-5 py-3">
          {footer}
        </div>
      )}
    </section>
  );
};

export default Card;