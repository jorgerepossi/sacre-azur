import React, { forwardRef, type HTMLAttributes } from "react";

interface GridProps<T = HTMLDivElement> extends HTMLAttributes<T> {
  className?: string;
}

const Grid = forwardRef<HTMLDivElement, GridProps<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`grid ${className}`} {...props}>
        {children}
      </div>
    );
  },
);

Grid.displayName = "Grid";

export default Grid;
