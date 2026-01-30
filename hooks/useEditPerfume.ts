import { useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useTenant } from "@/providers/TenantProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useFetchBrands } from "@/hooks/useFetchBrands";

import { supabase } from "@/lib/supabaseClient";

type Note = {
  id: number;
  name: string;
};

type FormValues = {
  name: string;
  description: string;
  price: number;
  profit_margin: number;
  external_link: string;
  brand_id: string;
  image?: FileList;
  in_stock: boolean;
  note_ids: string[];
};

export function useEditPerfume() {
  const { control, handleSubmit, setValue, register, reset } =
    useForm<FormValues>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalPath, setOriginalPath] = useState<string | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [tenantProductId, setTenantProductId] = useState<string | null>(null);

  const orderNotes = allNotes.sort((a, b) => a.name.localeCompare(b.name));

  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
    isPending,
  } = useFetchBrands();

  const { tenant } = useTenant();
  const router = useRouter();
  const searchParams = useSearchParams();
  const perfumeId = searchParams.get("id");

  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("perfume_notes")
        .select("id, name");

      if (!error) setAllNotes(data || []);
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (!perfumeId || !tenant?.id) return;

    const fetchPerfumeData = async () => {
      const { data: tenantProduct, error: tenantProductError } = await supabase
        .from("tenant_products")
        .select(
          `
          id,
          price,
          profit_margin,
          stock,
          perfume:perfume_id (
            id,
            name,
            description,
            image,
            external_link,
            brand_id
          )
        `,
        )
        .eq("perfume_id", perfumeId)
        .eq("tenant_id", tenant.id)
        .single();

      if (tenantProductError || !tenantProduct) {
        toast.error("Error loading perfume data");
        setLoading(false);
        return;
      }

      const perfumeData = Array.isArray(tenantProduct.perfume)
        ? tenantProduct.perfume[0]
        : tenantProduct.perfume;

      setTenantProductId(tenantProduct.id);

      // Fetch existing notes relations
      const { data: relationsData } = await supabase
        .from("perfume_note_relation")
        .select("note_id")
        .eq("perfume_id", perfumeId);

      const initialNotes =
        relationsData?.map((r) => r.note_id.toString()) || [];
      setSelectedNotes(initialNotes);

      // Reset form con TODOS los datos (perfume + tenant_products)
      reset({
        name: perfumeData.name,
        description: perfumeData.description,
        external_link: perfumeData.external_link,
        brand_id: perfumeData.brand_id,
        price: Number(tenantProduct.price),
        profit_margin: Number(tenantProduct.profit_margin),
        in_stock: tenantProduct.stock > 0,
        note_ids: initialNotes,
        image: undefined,
      });

      // Handle image preview
      const path = perfumeData.image?.replace(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfume-images/`,
        "",
      );
      setPreview(perfumeData.image);
      setOriginalPath(path || null);
      setLoading(false);
    };

    fetchPerfumeData();
  }, [perfumeId, tenant?.id, reset]);

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

  const updateNotesRelations = async (noteIds: string[]) => {
    if (!perfumeId) return;

    // Delete existing relations
    await supabase
      .from("perfume_note_relation")
      .delete()
      .eq("perfume_id", perfumeId);

    // Insert new relations if any
    if (noteIds.length > 0) {
      const relations = noteIds.map((noteId) => ({
        perfume_id: perfumeId,
        note_id: parseInt(noteId),
      }));

      const { error } = await supabase
        .from("perfume_note_relation")
        .insert(relations);

      if (error) throw error;
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!tenant?.id) {
      toast.error("No tenant found");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = preview;

      if (data.image && data.image[0]) {
        const newFile = data.image[0];

        if (originalPath) {
          const { error: deleteError } = await supabase.storage
            .from("perfume-images")
            .remove([originalPath]);

          if (deleteError) {
            console.warn("Error deleting old image:", deleteError);
          }
        }

        const newPath = `perfumes/${Date.now()}-${newFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("perfume-images")
          .upload(newPath, newFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfume-images/${newPath}`;
      }

      const { data: perfumeResult, error: perfumeError } = await supabase
        .from("perfume")
        .update({
          name: data.name,
          description: data.description,
          external_link: data.external_link,
          brand_id: data.brand_id,
          image: imageUrl,
        })
        .eq("id", perfumeId)
        .select();

      if (perfumeError) throw perfumeError;

      const { data: updateResult, error: tenantProductError } = await supabase
        .from("tenant_products")
        .update({
          price: data.price.toString(),
          profit_margin: data.profit_margin.toString(),
          stock: data.in_stock ? 100 : 0,
        })
        .eq("id", tenantProductId)
        .select();

      if (tenantProductError) throw tenantProductError;

      await updateNotesRelations(data.note_ids);

      toast.success("Perfume updated successfully!");

      await queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      await queryClient.invalidateQueries({ queryKey: ["tenant-products"] });

      router.push(`/${tenant.slug}/dashboard/perfumes`);
    } catch (error) {
      console.error("Error updating perfume:", error);
      toast.error("Failed to update perfume");
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };
  return {
    control,
    register,
    loading,
    preview,
    brands,
    onSubmit,
    allNotes,
    isPending,
    orderNotes,
    brandsError,
    fileInputRef,
    showCropModal,
    tempImageSrc,
    handleCropComplete,
    setShowCropModal,
    handleSubmit,
    selectedNotes,
    brandsLoading,
    handleIconClick,
    setSelectedNotes,
    handleImageChange,
  };
}
