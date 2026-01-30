import React from "react";

const EditPerfumeSkeleton = () => {
  return (
    <div className="mx-auto animate-pulse gap-[2rem] rounded-lg border bg-card p-[1.5rem] shadow-sm">
      <div className="flex flex-col gap-[2rem]">
        {/* HEADER: Título y Switch de Stock */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 rounded-md bg-muted" /> {/* Title */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-muted" /> {/* Label */}
            <div className="h-6 w-11 rounded-full bg-muted" /> {/* Switch */}
          </div>
        </div>

        <div className="flex flex-col gap-[2rem] md:flex-row">
          {/* COLUMNA IZQUIERDA: Form Principal */}
          <div className="flex flex-1 flex-col gap-[2rem]">
            {/* Name Input */}
            <div className="flex w-full flex-col gap-[1rem]">
              <div className="h-4 w-12 rounded bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>

            {/* Editor de Texto (Description) */}
            <div className="flex w-full flex-col gap-[1rem]">
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="flex flex-col gap-[1rem]">
                <div className="flex justify-between border-b pb-2">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-8 rounded bg-muted" />
                    ))}
                  </div>
                  <div className="h-8 w-16 rounded bg-muted" />
                </div>
                <div className="h-32 w-full rounded-md bg-muted" />
              </div>
            </div>

            {/* Precios y Margen */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                <div className="h-4 w-12 rounded bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-4 w-12 rounded bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-10 w-full rounded-md bg-muted" />
              </div>
            </div>

            {/* Precios Finales (Card Muted) */}
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
            </div>
          </div>

          {/* COLUMNA DERECHA: Acordes e Imagen */}
          <div className="flex w-full flex-col gap-[2rem] md:w-[300px]">
            {/* Select Acordes */}
            <div className="flex flex-col gap-[1rem]">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-10 w-full rounded-md bg-muted" />
              {/* Tags de acordes */}
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-20 rounded-full bg-muted" />
                ))}
              </div>
            </div>

            {/* Imagen Upload Area */}
            <div className="flex flex-col gap-[1rem]">
              <div className="h-10 w-full rounded-md bg-muted" />
              <div className="flex justify-center">
                <div className="h-32 w-32 rounded-md bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Link Externo */}
        <div className="flex w-full flex-col gap-[1rem]">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-10 w-full rounded-md bg-muted" />
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex w-full gap-[1rem]">
          <div className="h-10 flex-1 rounded-md bg-muted" />
          <div className="h-10 flex-1 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default EditPerfumeSkeleton;
