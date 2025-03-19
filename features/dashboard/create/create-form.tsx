import React from 'react';
import Flex from "@/components/flex";
import {Button} from "@/components/ui/button";

const CreateForm = () => {
    return (
        <form className={'max-w-[700px]'}>
            <Flex className={'flex-col gap-[3rem]'}>
                <Flex className={'flex-col gap-[1rem]'}>

                    <input type="text" name={'name'} placeholder={'Name'}/>
                    <input type="text" name={'description'} placeholder={'Description'}/>
                    <input type="number" name={'price'} placeholder={'Price'}/>
                    <input type="number" name={'profit_margin'} placeholder={'Price'}/>
                    <input type="text" name={'external_link'} placeholder={'External Link'}/>
                    <input type={'file'} name={'image'} placeholder={'Image'}/>
                </Flex>
                <Button  > Create New </Button>
            </Flex>
        </form>
    );
};

export default CreateForm;