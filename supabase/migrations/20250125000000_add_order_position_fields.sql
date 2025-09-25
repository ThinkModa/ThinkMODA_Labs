-- Add order_position fields for proper lesson and section ordering
-- This migration preserves all existing data and adds ordering capabilities

-- ==============================================
-- 1. ADD ORDER_POSITION TO SECTIONS TABLE
-- ==============================================

-- Add order_position column to sections table
ALTER TABLE public.sections 
ADD COLUMN IF NOT EXISTS order_position INTEGER;

-- Set initial order_position values based on creation time (preserves existing order)
-- This ensures no data is lost and maintains current ordering
UPDATE public.sections 
SET order_position = EXTRACT(EPOCH FROM created_at)::INTEGER
WHERE order_position IS NULL;

-- Make order_position NOT NULL with a default value
ALTER TABLE public.sections 
ALTER COLUMN order_position SET NOT NULL;

-- Add default value for future inserts
ALTER TABLE public.sections 
ALTER COLUMN order_position SET DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER;

-- ==============================================
-- 2. ADD ORDER_POSITION TO LESSONS TABLE
-- ==============================================

-- Add order_position column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS order_position INTEGER;

-- Set initial order_position values based on creation time (preserves existing order)
-- This ensures no data is lost and maintains current ordering
UPDATE public.lessons 
SET order_position = EXTRACT(EPOCH FROM created_at)::INTEGER
WHERE order_position IS NULL;

-- Make order_position NOT NULL with a default value
ALTER TABLE public.lessons 
ALTER COLUMN order_position SET NOT NULL;

-- Add default value for future inserts
ALTER TABLE public.lessons 
ALTER COLUMN order_position SET DEFAULT EXTRACT(EPOCH FROM NOW())::INTEGER;

-- ==============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sections_order_position 
ON public.sections(course_id, order_position);

CREATE INDEX IF NOT EXISTS idx_lessons_order_position 
ON public.lessons(section_id, order_position);

-- ==============================================
-- 4. ADD COMMENTS FOR DOCUMENTATION
-- ==============================================

COMMENT ON COLUMN public.sections.order_position IS 'Order position within the course (lower numbers appear first)';
COMMENT ON COLUMN public.lessons.order_position IS 'Order position within the section (lower numbers appear first)';

-- ==============================================
-- 5. VERIFY DATA INTEGRITY
-- ==============================================

-- Verify that all sections have order_position values
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM public.sections WHERE order_position IS NULL) THEN
        RAISE EXCEPTION 'Some sections still have NULL order_position values';
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.lessons WHERE order_position IS NULL) THEN
        RAISE EXCEPTION 'Some lessons still have NULL order_position values';
    END IF;
    
    RAISE NOTICE 'All sections and lessons have order_position values set successfully';
END $$;
