"use client"
import React, {useState, createContext } from 'react';

interface AsideProps {
    children: React.ReactNode;
}


const AsideWrapper = ({children}: AsideProps) => {
    return (
        <aside className={'w-full md:w-[320px] shrink-0 border rounded-lg p-4 bg-card'}>
            {children}
        </aside>
    );
};

export default AsideWrapper;