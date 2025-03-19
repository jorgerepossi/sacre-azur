import React, { forwardRef, type HTMLAttributes } from 'react'

interface DivProps<T = HTMLDivElement> extends HTMLAttributes<T> {
    className?: string
}

const Section = forwardRef<HTMLDivElement, DivProps<HTMLDivElement>>(
    ({ children, className = '', ...props }, ref) => {
        return (
            <section ref={ref} className={` ${className}`} {...props}>
                {children}
            </section>
        )
    },
)

Section.displayName = 'Section'

export default Section
