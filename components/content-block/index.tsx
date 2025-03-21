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
            <Section className={'relative '}>
                <Flex className={'items-center   h-[3.5rem]'}>
                    <p className={'text-headline-small'}>{title}</p>
                </Flex>
            </Section>
            {children}
        </Flex>
    );
};

export default ContentBlock;