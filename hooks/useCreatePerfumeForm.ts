import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useFetchFamilies } from "@/hooks/fetchs/useFetchFamilies";
import { useFetchNotes } from "@/hooks/fetchs/useFetchNotes";
import { useCreatePerfume } from "@/hooks/useCreatePerfume";
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
  const { data: brands, isLoading: brandsLoading, error: brandsError } = useFetchBrands();
  const { data: notes } = useFetchNotes();
  const { data: families } = useFetchFamilies();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

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
        onError: () => {
          toast.error("Hubo un error al crear el perfume.");
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
  };
};
