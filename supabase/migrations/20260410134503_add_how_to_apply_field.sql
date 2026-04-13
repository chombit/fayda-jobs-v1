-- Add how_to_apply field to jobs table
ALTER TABLE jobs ADD COLUMN how_to_apply text NULL;

-- Add comment to describe the field
COMMENT ON COLUMN jobs.how_to_apply IS 'Instructions for how to apply, including required documents like CV, Transcript, ID, etc.';
