import React, { forwardRef, type HTMLAttributes } from 'react'

interface DivProps<T = HTMLDivElement> extends HTMLAttributes<T> {
    className?: string
}

const Box = forwardRef<HTMLDivElement, DivProps<HTMLDivElement>>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <div ref={ref} className={` ${className}`} {...props}>
                {children}
            </div>
        )
    },
)

Box.displayName = 'Box'

export default Box
