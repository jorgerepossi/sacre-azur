import React from "react";

import Flex from "@/components/flex";
import Section from "@/components/section";

interface ContentBlockProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const ContentBlock = ({
  children,
  title,
  subtitle,
  className = "",
}: ContentBlockProps) => {
  return (
    <Flex className={`h-full w-full flex-col gap-[1.25rem] ${className} `}>
      <Section className={"relative"}>
        <Flex className={"h-[3.5rem] items-center"}>
          <p className={"text-headline-small"}>{title}</p>
        </Flex>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </Section>
      {children}
    </Flex>
  );
};

export default ContentBlock;
