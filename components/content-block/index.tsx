import React from "react";

import Flex from "@/components/flex";
import Section from "@/components/section";

interface ContentBlockProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  quantity?: number;
}

const ContentBlock = ({
  children,
  title,
  subtitle,
  quantity,
  className = "",
}: ContentBlockProps) => {
  return (
    <Flex className={`h-full w-full flex-col gap-[1.25rem] ${className} `}>
      <Section className={"relative"}>
        <Flex className={"h-[3.5rem] items-center"}>
          <p className={"text-headline-small"}>{title} { quantity && <span className={'text-sm w-[48px] h-[48px] rounded-full p-2 bg-zinc-300'}>{quantity}</span>}</p>
        </Flex>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </Section>
      {children}
    </Flex>
  );
};

export default ContentBlock;
