"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
 

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
}

export default function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const CANVAS_SIZE = 400;

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      setImage(img);
      // Centrar imagen inicialmente
      const initialScale = CANVAS_SIZE / Math.max(img.width, img.height);
      setScale(initialScale);
      setPosition({
        x: (CANVAS_SIZE - img.width * initialScale) / 2,
        y: (CANVAS_SIZE - img.height * initialScale) / 2,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Fondo gris
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Dibujar imagen
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    ctx.restore();

    // Dibujar guías de recorte
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(50, 50, CANVAS_SIZE - 100, CANVAS_SIZE - 100);
  }, [image, scale, position]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

const handleSave = () => {
  if (!image || !canvasRef.current) return;

  const cropCanvas = document.createElement("canvas");
  const cropSize = 800;  // ← CAMBIAR DE 300 a 800
  cropCanvas.width = cropSize;
  cropCanvas.height = cropSize;
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) return;

  // AGREGAR FONDO BLANCO
  cropCtx.fillStyle = "#FFFFFF";
  cropCtx.fillRect(0, 0, cropSize, cropSize);

  // Calcular área de recorte
  const sourceX = (50 - position.x) / scale;
  const sourceY = (50 - position.y) / scale;
  const sourceSize = (CANVAS_SIZE - 100) / scale;

  // Dibujar imagen recortada
  cropCtx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    cropSize,
    cropSize
  );

  // Convertir a blob
  cropCanvas.toBlob((blob) => {
    if (blob) {
      onCropComplete(blob);
    }
  }, "image/jpeg", 0.9);
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajustar Imagen</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border border-gray-300 cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          <div className="w-full space-y-2">
            <label className="text-sm font-medium">
              Tamaño: {Math.round(scale * 100)}%
            </label>
            <Slider
              value={[scale]}
              onValueChange={handleScaleChange}
              min={0.1}
              max={3}
              step={0.01}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Arrastra la imagen para mover, usa el slider para cambiar el tamaño
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}