import React from 'react';
import Flex from "@/components/flex";
import Section from "@/components/section";
import ContentBlock from "@/components/content-block";
import CreateForm from "@/features/dashboard/create/create-form";

const CreatePageContent = () => {
    return (
        <ContentBlock title={'Create '}>
            <Section>
                <CreateForm />
            </Section>
        </ContentBlock>
    );
};

export default CreatePageContent;