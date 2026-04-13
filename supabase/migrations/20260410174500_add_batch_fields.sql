-- Add batch job tracking fields
ALTER TABLE jobs ADD COLUMN batch_id text NULL;
ALTER TABLE jobs ADD COLUMN is_batch_job boolean DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN jobs.batch_id IS 'Identifier to group jobs created in the same batch posting';
COMMENT ON COLUMN jobs.is_batch_job IS 'Flag to indicate if this job was created as part of a batch posting';

-- Create index for faster batch queries
CREATE INDEX idx_jobs_batch_id ON jobs(batch_id) WHERE batch_id IS NOT NULL;
