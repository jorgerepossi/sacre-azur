//import Hero from "@/components/hero";
//import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
//import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
//import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import AsideWrapper from "@/components/aside";
import AsideContent, {BrandFilterProvider} from "@/features/aside-content";
import {PerfumeGrid} from "@/components/perfum-grid";
import PerfumeGridClient from "@/features/perfum-grid-client";

export default async function Home() {
    return (
        <BrandFilterProvider>
            <main className="flex-1 flex flex-col gap-6 p-5">

                <div className={'flex flex-col md:flex-row gap-6'}>
                    <AsideWrapper>
                        <AsideContent/>
                    </AsideWrapper>
                    <div className="flex-1">
                        <PerfumeGridClient/>
                    </div>
                </div>

            </main>
        </BrandFilterProvider>
    );
}
