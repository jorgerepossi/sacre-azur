"use client";


import ContentBlock from "@/components/content-block";
import CreateForm from "@/features/dashboard/create/create-form";
import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import {Card} from "@/components/ui/card";
import Flex from "@/components/flex";


const CreatePageContent = () => {


    return (
        <Flex className={' flex-col lg:flex-row gap-[2rem]'}>
            <ContentBlock title={"Create new perfume"} className={'flex-1'}>
                <Card className={'flex flex-col !p-[2rem] gap-[2rem] '}>
                    <CreateForm/>
                </Card>


            </ContentBlock>
            <ContentBlock title={"Create new brand"} className={'flex-1 max-w-[500px] '}>
                <Card className={'flex flex-col   gap-[2rem]  !p-[2rem] w-full justify-center items-center'}>
                    <CreateBrandForm/>
                </Card>
            </ContentBlock>
        </Flex>
    );
};

export default CreatePageContent;