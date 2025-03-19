import React from 'react';
import Section from "@/components/section";
import Flex from "@/components/flex";

interface ContentBlockProps {
    children?: React.ReactNode;
    title?: string;
}

const ContentBlock = ({
    children, title
                      }: ContentBlockProps) => {
    return (
        <Flex className={'flex-col w-full  h-full gap-[1.25rem]'}>
            <Section className={'relative h-[3.5rem]'}>
                <Flex className={'items-center h-full'}>
                    <p>{title}</p>
                </Flex>
            </Section>
            {children}
        </Flex>
    );
};

export default ContentBlock;