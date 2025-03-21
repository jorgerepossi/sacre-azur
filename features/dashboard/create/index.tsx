"use client";

import Box from "@/components/box";
import Section from "@/components/section";
import ContentBlock from "@/components/content-block";
import CreateForm from "@/features/dashboard/create/create-form";
import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import {Card} from "@/components/ui/card";
import Flex from "@/components/flex";



const CreatePageContent = () => {


    return (
        <ContentBlock title={"Create new perfume or brand"}>



            <Flex  className={'grid grid-cols-1 lg:grid-cols-2 gap-[2rem]'}>
                <Card className={'flex flex-col p-[1.5rem] gap-[2rem]'}>
                    <p className={'text-headline-subtitle'}> Create new Perfume</p>
                    <CreateForm />
                </Card>
                <Card className={'flex flex-col p-[1.5rem] gap-[2rem]'}>
                    <p className={'text-headline-subtitle'}> Create new Brand </p>
                    <CreateBrandForm/>
                </Card>
            </Flex>


        </ContentBlock>
    );
};

export default CreatePageContent;