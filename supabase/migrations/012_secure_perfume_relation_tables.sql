-- perfume_note_relation, perfume_to_families and perfume_to_notes are pure
-- catalog join tables (perfume<->note / perfume<->family), same shared
-- global catalog as brand/perfume (no tenant_id, no ownership). They had
-- ALL/insert/update/delete policies with USING(true) or WITH CHECK(true)
-- for `public`/`authenticated` roles — any signed-in (or in
-- perfume_note_relation's case, even anonymous) caller could rewrite or
-- delete any perfume's notes/family tags.
--
-- Mirrors the brand/perfume fix (009): public read (storefront needs it),
-- writes require at least one tenant_users membership (matches the
-- dashboard catalog edit flows in useCreatePerfume/useEditPerfume), delete
-- restricted to super admins since removing a shared tag affects every
-- tenant selling that perfume.

-- perfume_note_relation
DROP POLICY IF EXISTS "Allow all on perfume_note_relation" ON perfume_note_relation;
DROP POLICY IF EXISTS "Public read access to perfume_note_relation" ON perfume_note_relation;
DROP POLICY IF EXISTS "Anyone can view perfume_note_relation" ON perfume_note_relation;

CREATE POLICY "perfume_note_relation_public_select" ON perfume_note_relation
  FOR SELECT
  USING (true);

CREATE POLICY "perfume_note_relation_insert" ON perfume_note_relation
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_note_relation_update" ON perfume_note_relation
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_note_relation_delete" ON perfume_note_relation
  FOR DELETE
  USING (is_super_admin(auth.uid()));

-- perfume_to_families
DROP POLICY IF EXISTS "Allow authenticated delete perfume_to_families" ON perfume_to_families;
DROP POLICY IF EXISTS "Allow authenticated insert perfume_to_families" ON perfume_to_families;
DROP POLICY IF EXISTS "Anyone can view perfume_to_families" ON perfume_to_families;
DROP POLICY IF EXISTS "Public read access to perfume_to_families" ON perfume_to_families;
DROP POLICY IF EXISTS "Allow public read perfume_to_families" ON perfume_to_families;
DROP POLICY IF EXISTS "Allow authenticated update perfume_to_families" ON perfume_to_families;

CREATE POLICY "perfume_to_families_public_select" ON perfume_to_families
  FOR SELECT
  USING (true);

CREATE POLICY "perfume_to_families_insert" ON perfume_to_families
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_to_families_update" ON perfume_to_families
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_to_families_delete" ON perfume_to_families
  FOR DELETE
  USING (is_super_admin(auth.uid()));

-- perfume_to_notes
DROP POLICY IF EXISTS "Allow authenticated delete perfume_to_notes" ON perfume_to_notes;
DROP POLICY IF EXISTS "Allow authenticated insert perfume_to_notes" ON perfume_to_notes;
DROP POLICY IF EXISTS "Anyone can view perfume_to_notes" ON perfume_to_notes;
DROP POLICY IF EXISTS "Public read access to perfume_to_notes" ON perfume_to_notes;
DROP POLICY IF EXISTS "Allow authenticated update perfume_to_notes" ON perfume_to_notes;

CREATE POLICY "perfume_to_notes_public_select" ON perfume_to_notes
  FOR SELECT
  USING (true);

CREATE POLICY "perfume_to_notes_insert" ON perfume_to_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_to_notes_update" ON perfume_to_notes
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM tenant_users WHERE user_id = auth.uid())
    OR is_super_admin(auth.uid())
  );

CREATE POLICY "perfume_to_notes_delete" ON perfume_to_notes
  FOR DELETE
  USING (is_super_admin(auth.uid()));
