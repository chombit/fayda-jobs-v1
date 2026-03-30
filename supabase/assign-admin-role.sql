-- Assign Admin Role - Run this after the main schema

-- Step 1: Find your user ID
SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- Step 2: Replace YOUR_USER_ID_HERE with your actual ID from above
INSERT INTO public.user_roles (user_id, role) 
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify admin role
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
