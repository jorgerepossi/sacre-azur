"use client";

import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import CreateForm from "@/features/dashboard/create/create-form";

import ContentBlock from "@/components/content-block";
import Flex from "@/components/flex";
import { Card } from "@/components/ui/card";

const CreatePageContent = () => {
  return (
    <Flex className={"flex-col gap-[2rem] lg:flex-row"}>
      <ContentBlock title={"Create new perfume"} className={"flex-1"}>
        <Card className={"flex flex-col gap-[2rem] !p-[2rem]"}>
          <CreateForm />
        </Card>
      </ContentBlock>
      <ContentBlock
        title={"Create new brand"}
        className={"max-w-[500px] flex-1"}
      >
        <Card
          className={
            "flex w-full flex-col items-center justify-center gap-[2rem] !p-[2rem]"
          }
        >
          <CreateBrandForm />
        </Card>
      </ContentBlock>
    </Flex>
  );
};

export default CreatePageContent;
