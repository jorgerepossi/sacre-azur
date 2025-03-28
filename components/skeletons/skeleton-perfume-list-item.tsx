import React from 'react';

const SkeletonPerfumeListItem = () => {
    return (
        <div
            className="flex !hover:shadow-md w-full overflow-hidden rounded-lg border bg-background_white !shadow-sm transition-all duration-300 hover:-translate-y-1">
            <div className="flex w-full p-0">
                <div className="flex w-full  p-[1rem] flex-col">
                    <div className="flex flex-1 items-center justify-center py-4 md:py-2"><img alt="Lune Feline"
                                                                                               loading="lazy"
                                                                                               width="200" height="100"
                                                                                               decoding="async"
                                                                                               data-nimg="1"
                                                                                               className="object-cover"
                                                                                               srcSet="/_next/image?url=https%3A%2F%2Fwscjryexgtlhtiqwfeck.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fperfume-images%2Fperfumes%2F1742591916544-lune-feline.jpg&amp;w=256&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fwscjryexgtlhtiqwfeck.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fperfume-images%2Fperfumes%2F1742591916544-lune-feline.jpg&amp;w=640&amp;q=75 2x"
                                                                                               src="/_next/image?url=https%3A%2F%2Fwscjryexgtlhtiqwfeck.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fperfume-images%2Fperfumes%2F1742591916544-lune-feline.jpg&amp;w=640&amp;q=75"
                                                                                               />
                    </div>
                    <div className="flex flex-col justify-between pb-[1rem] pt-[2rem] md:flex-row">
                        <div className="flex flex-1 flex-col gap-[.25rem]"><p className="m-0 font-bold">Lune Feline</p>
                            <p className="m-0 text-body-medium text-muted-foreground">by Atelier des Ors</p></div>
                    </div>
                    <div className="flex justify-between gap-[1rem] border-t-2 border-muted pt-[16px]">
                        <button
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[120px]">Add
                            wishlist
                        </button>
                        <a className="w-[120px]" href="/perfume/lune-feline_13925a61-1a2b-45d4-b0f6-f6933ef37826">
                            <button
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 !bg-button-black w-full"
                                color="bg-button-black">View Detail
                            </button>
                        </a></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonPerfumeListItem;