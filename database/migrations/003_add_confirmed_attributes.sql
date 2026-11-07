ALTER TABLE public.clothing_items
ADD COLUMN IF NOT EXISTS confirmed_attributes JSONB
NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.clothing_items.confirmed_attributes
IS 'Contains only clothing attributes explicitly confirmed by the user.';