import React from "react";

const EditPerfumeSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card shadow-sm mx-auto gap-[2rem] p-[1.5rem] animate-pulse">
      <div className="flex flex-col gap-[2rem]">
        
        {/* HEADER: Título y Switch de Stock */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted rounded-md" /> {/* Title */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted rounded" /> {/* Label */}
            <div className="h-6 w-11 bg-muted rounded-full" /> {/* Switch */}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-[2rem]">
          {/* COLUMNA IZQUIERDA: Form Principal */}
          <div className="flex flex-col gap-[2rem] flex-1">
            
            {/* Name Input */}
            <div className="flex w-full flex-col gap-[1rem]">
              <div className="h-4 w-12 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
            </div>

            {/* Editor de Texto (Description) */}
            <div className="flex w-full flex-col gap-[1rem]">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="flex flex-col gap-[1rem]">
                <div className="flex justify-between border-b pb-2">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-8 bg-muted rounded" />
                    ))}
                  </div>
                  <div className="h-8 w-16 bg-muted rounded" />
                </div>
                <div className="h-32 w-full bg-muted rounded-md" />
              </div>
            </div>

            {/* Precios y Margen */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded-md" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded-md" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded-md" />
              </div>
            </div>

            {/* Precios Finales (Card Muted) */}
            <div className="rounded-lg border p-4 bg-muted/20 space-y-3">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
            </div>
          </div>

          {/* COLUMNA DERECHA: Acordes e Imagen */}
          <div className="flex flex-col gap-[2rem] w-full md:w-[300px]">
            
            {/* Select Acordes */}
            <div className="flex flex-col gap-[1rem]">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded-md" />
              {/* Tags de acordes */}
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-20 bg-muted rounded-full" />
                ))}
              </div>
            </div>

            {/* Imagen Upload Area */}
            <div className="flex flex-col gap-[1rem]">
              <div className="h-10 w-full bg-muted rounded-md" />
              <div className="flex justify-center">
                <div className="h-32 w-32 bg-muted rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Link Externo */}
        <div className="flex w-full flex-col gap-[1rem]">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded-md" />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex w-full gap-[1rem]">
          <div className="h-10 flex-1 bg-muted rounded-md" />
          <div className="h-10 flex-1 bg-muted rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default EditPerfumeSkeleton;