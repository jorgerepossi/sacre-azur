import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalPath, setOriginalPath] = useState<string | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const orderNotes = allNotes.sort((a, b) => a.name.localeCompare(b.name));

  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useFetchBrands();
  const router = useRouter();
  const searchParams = useSearchParams();
  const perfumeId = searchParams.get("id");

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
    if (!perfumeId) return;

    const fetchPerfumeData = async () => {
      // Fetch perfume data
      const { data: perfumeData, error: perfumeError } = await supabase
        .from("perfume")
        .select("*")
        .eq("id", perfumeId)
        .single();

      if (perfumeError || !perfumeData) {
        toast.error("Error loading perfume data");
        return;
      }

      // Fetch existing notes relations
      const { data: relationsData } = await supabase
        .from("perfume_note_relation")
        .select("note_id")
        .eq("perfume_id", perfumeId);

      const initialNotes =
        relationsData?.map((r) => r.note_id.toString()) || [];
      setSelectedNotes(initialNotes);

      // Reset form with all data
      reset({
        ...perfumeData,
        note_ids: initialNotes,
        image: undefined, // Handle file input separately
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
  }, [perfumeId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setValue("image", e.target.files);
    }
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
    setLoading(true);

    try {
      // Update perfume data
      let imageUrl = preview;

      if (data.image && data.image[0] && originalPath) {
        const { error: uploadError } = await supabase.storage
          .from("perfume-images")
          .upload(originalPath, data.image[0], { upsert: true });

        if (uploadError) throw uploadError;

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfume-images/${originalPath}`;
      }

      const { error: updateError } = await supabase
        .from("perfume")
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          profit_margin: data.profit_margin,
          external_link: data.external_link,
          brand_id: data.brand_id,
          image: imageUrl,
          in_stock: data.in_stock,
        })
        .eq("id", perfumeId);

      if (updateError) throw updateError;

      // Update notes relationships
      await updateNotesRelations(data.note_ids);

      toast.success("Perfume updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to update perfume");
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    register,
    loading,
    preview,
    brands,
    brandsLoading,
    brandsError,
    handleImageChange,
    onSubmit,
    allNotes,
    orderNotes,
    selectedNotes,
    setSelectedNotes,
  };
}
