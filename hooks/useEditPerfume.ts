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
  size?: number;
  external_link: string;
  brand_id: string;
  image?: FileList;
  in_stock: boolean;
  top_note_ids: string[];
  heart_note_ids: string[];
  base_note_ids: string[];
  family_ids: string[];
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
  const [allFamilies, setAllFamilies] = useState<Note[]>([]); // Using same simplified Note type
  const [topNotes, setTopNotes] = useState<string[]>([]);
  const [heartNotes, setHeartNotes] = useState<string[]>([]);
  const [baseNotes, setBaseNotes] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [tenantProductId, setTenantProductId] = useState<string | null>(null);

  const orderNotes = allNotes.sort((a, b) => a.name.localeCompare(b.name));
  const orderFamilies = allFamilies.sort((a, b) => a.name.localeCompare(b.name));

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
    const fetchData = async () => {
      // Fetch available notes
      const { data: notesData } = await supabase
        .from("perfume_notes")
        .select("id, name");
      if (notesData) setAllNotes(notesData);

      // Fetch available families
      const { data: familiesData } = await supabase
        .from("olfactive_families")
        .select("id, name");
      if (familiesData) setAllFamilies(familiesData);
    };

    fetchData();
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

      // Fetch current notes from perfume_to_notes
      const { data: notesRelations } = await supabase
        .from("perfume_to_notes")
        .select("note_id, note_type")
        .eq("perfume_id", perfumeId);

      const initialTop =
        notesRelations
          ?.filter((r) => r.note_type === "top")
          .map((r) => r.note_id.toString()) || [];
      const initialHeart =
        notesRelations
          ?.filter((r) => r.note_type === "heart")
          .map((r) => r.note_id.toString()) || [];
      const initialBase =
        notesRelations
          ?.filter((r) => r.note_type === "base")
          .map((r) => r.note_id.toString()) || [];

      setTopNotes(initialTop);
      setHeartNotes(initialHeart);
      setBaseNotes(initialBase);

      // Fetch current families from perfume_to_families
      const { data: familiesRelations } = await supabase
        .from("perfume_to_families")
        .select("family_id")
        .eq("perfume_id", perfumeId);

      const initialFamilies =
        familiesRelations?.map((r) => r.family_id.toString()) || [];
      setSelectedFamilies(initialFamilies);

      reset({
        name: perfumeData.name,
        description: perfumeData.description,
        external_link: perfumeData.external_link,
        brand_id: perfumeData.brand_id,
        price: Number(tenantProduct.price),
        profit_margin: Number(tenantProduct.profit_margin),
        in_stock: tenantProduct.stock > 0,
        top_note_ids: initialTop,
        heart_note_ids: initialHeart,
        base_note_ids: initialBase,
        family_ids: initialFamilies,
        image: undefined,
      });

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

  const updateOlfactoryData = async (
    topNoteIds: string[],
    heartNoteIds: string[],
    baseNoteIds: string[],
    familyIds: string[],
  ) => {
    if (!perfumeId) return;

    // 1. Update Notes (perfume_to_notes)
    await supabase.from("perfume_to_notes").delete().eq("perfume_id", perfumeId);

    const allNoteRelations = [
      ...topNoteIds.map((id) => ({
        perfume_id: perfumeId,
        note_id: parseInt(id),
        note_type: "top" as const,
      })),
      ...heartNoteIds.map((id) => ({
        perfume_id: perfumeId,
        note_id: parseInt(id),
        note_type: "heart" as const,
      })),
      ...baseNoteIds.map((id) => ({
        perfume_id: perfumeId,
        note_id: parseInt(id),
        note_type: "base" as const,
      })),
    ];

    if (allNoteRelations.length > 0) {
      const { error: noteError } = await supabase
        .from("perfume_to_notes")
        .insert(allNoteRelations);

      if (noteError) throw noteError;
    }

    // 2. Update Families (perfume_to_families)
    // ... around line 215 in original
    await supabase
      .from("perfume_to_families")
      .delete()
      .eq("perfume_id", perfumeId);

    if (familyIds.length > 0) {
      const familyRelations = familyIds.map((familyId) => ({
        perfume_id: perfumeId,
        family_id: parseInt(familyId),
      }));

      const { error: familyError } = await supabase
        .from("perfume_to_families")
        .insert(familyRelations);

      if (familyError) throw familyError;
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

      const isDecantSeller =
        tenant?.product_type === "decant" || !tenant?.product_type;

      const { data: updateResult, error: tenantProductError } = await supabase
        .from("tenant_products")
        .update({
          price: data.price.toString(),
          profit_margin: isDecantSeller ? data.profit_margin.toString() : "0",
          stock: data.in_stock ? 100 : 0,
          ...(!isDecantSeller && data.size && { size: data.size.toString() }),
        })
        .eq("id", tenantProductId)
        .select();

      if (tenantProductError) throw tenantProductError;

      await updateOlfactoryData(
        data.top_note_ids,
        data.heart_note_ids,
        data.base_note_ids,
        data.family_ids,
      );

      toast.success("Perfume updated successfully!");

      await queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      await queryClient.invalidateQueries({ queryKey: ["tenant-products"] });
      await queryClient.invalidateQueries({ queryKey: ["brands"] });

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
    allFamilies,
    isPending,
    orderNotes,
    orderFamilies,
    brandsError,
    fileInputRef,
    showCropModal,
    tempImageSrc,
    handleCropComplete,
    setShowCropModal,
    handleSubmit,
    topNotes,
    heartNotes,
    baseNotes,
    selectedFamilies,
    brandsLoading,
    handleIconClick,
    setTopNotes,
    setHeartNotes,
    setBaseNotes,
    setSelectedFamilies,
    handleImageChange,
  };
}
