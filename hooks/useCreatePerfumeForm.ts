import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useFetchFamilies } from "@/hooks/fetchs/useFetchFamilies";
import { useFetchNotes } from "@/hooks/fetchs/useFetchNotes";
import { useCreatePerfume } from "@/hooks/useCreatePerfume";
import { useAddExistingPerfume } from "@/hooks/useAddExistingPerfume";
import { useFetchBrands } from "@/hooks/useFetchBrands";

export type FormValues = {
  name: string;
  description: string;
  price: number;
  profit_margin: number;
  size?: number;
  external_link: string;
  image: FileList;
  brand_id: string;
  top_note_ids: string[];
  heart_note_ids: string[];
  base_note_ids: string[];
  family_ids: string[];
};

export const useCreatePerfumeForm = () => {
  const { control, handleSubmit, register, reset, setValue } =
    useForm<FormValues>();
  const [preview, setPreview] = useState<string | null>(null);
  const createPerfume = useCreatePerfume();
  const addExistingPerfume = useAddExistingPerfume();
  const { data: brands, isLoading: brandsLoading, error: brandsError } = useFetchBrands();
  const { data: notes } = useFetchNotes();
  const { data: families } = useFetchFamilies();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  // Modal para perfume existente
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [existingPerfumeData, setExistingPerfumeData] = useState<{
    id: string;
    name: string;
    brandName: string;
    price: number;
    profit_margin: number;
    size?: number;
  } | null>(null);

  const orderNotes = notes
    ? [...notes].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const orderFamilies = families
    ? [...families].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
      type: "image/jpeg",
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(croppedFile);

    setValue("image", dataTransfer.files);
    setPreview(URL.createObjectURL(croppedBlob));
    setShowCropModal(false);
    setTempImageSrc(null);
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleUseExistingPerfume = () => {
    if (!existingPerfumeData) return;

    addExistingPerfume.mutate(
      {
        perfumeId: existingPerfumeData.id,
        price: existingPerfumeData.price,
        profit_margin: existingPerfumeData.profit_margin,
        size: existingPerfumeData.size,
      },
      {
        onSuccess: () => {
          toast.success("Perfume agregado a tu inventario correctamente!");
          reset();
          setPreview(null);
          setShowExistingModal(false);
          setExistingPerfumeData(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: () => {
          toast.error("Error al agregar el perfume al inventario.");
        },
      },
    );
  };

  const handleOnSubmit = (data: FormValues) => {
    const imageFile = data.image[0];

    createPerfume.mutate(
      {
        name: data.name,
        description: data.description,
        price: data.price,
        profit_margin: data.profit_margin,
        external_link: data.external_link,
        imageFile,
        brand_id: data.brand_id,
        top_note_ids: data.top_note_ids,
        heart_note_ids: data.heart_note_ids,
        base_note_ids: data.base_note_ids,
        family_ids: data.family_ids,
      },
      {
        onSuccess: () => {
          toast.success("Perfume creado correctamente!");
          reset();
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: (error: any) => {
          const errorMessage = error.message || "Hubo un error al crear el perfume.";

          // Si el error es que el perfume ya existe
          if (errorMessage.includes("ya existe en el catálogo")) {
            const brandName = brands?.find((b: { id: string; }) => b.id === data.brand_id)?.name || "esta marca";

            setExistingPerfumeData({
              id: error.existingPerfumeId,
              name: data.name,
              brandName,
              price: data.price,
              profit_margin: data.profit_margin,
              size: data.size,
            });
            setShowExistingModal(true);
          } else {
            toast.error(errorMessage);
          }
        },
      },
    );
  };

  return {
    control,
    handleSubmit,
    register,
    reset,
    preview,
    setPreview,
    handleImageChange,
    handleIconClick,
    handleOnSubmit,
    createPerfume,
    brands,
    isLoading: brandsLoading,
    error: brandsError,
    fileInputRef,
    notes,
    orderNotes,
    families,
    orderFamilies,
    setValue,
    showCropModal,
    tempImageSrc,
    handleCropComplete,
    setShowCropModal,
    // Modal de perfume existente
    showExistingModal,
    setShowExistingModal,
    existingPerfumeData,
    handleUseExistingPerfume,
    setExistingPerfumeData,
    isAddingExisting: addExistingPerfume.isPending,
  };
};