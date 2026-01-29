## Explanation of the Fixes

I have analyzed the codebase and the issues you described. Here is a summary of the problems and the fixes I have implemented.

### 1. Technician Registration Flow

The technician registration flow was **mostly correct**. The issue was not that the registration page was calling an Edge Function, but rather a misunderstanding of the error message. The "Failed to send a request to the Edge Function" error was coming from the **admin applications page**, not the registration page.

The registration flow already uses the correct method of `supabase.auth.signUp` followed by `supabase.from('technicians').insert()`. I have made a small refactoring to make the code cleaner, but the core logic was already correct.

### 2. Admin Applications Page

The admin applications page was failing because the `get-technician-applications` Edge Function was correctly rejecting requests from users who are not admins. The root cause of the issue is that your admin user does not have the `admin` role in the `user_roles` table.

### 3. The Fix: Granting Admin Privileges

To fix this, you need to run the following SQL script in your Supabase SQL editor. This script will grant the `admin` role to your user.

**Please replace `'your-admin-email@example.com'` with the email address of your admin user.**

```sql
-- This script grants the 'admin' role to a user.
-- 1. Find the user_id from the auth.users table based on the email.
-- 2. Insert a new row into the public.user_roles table with the user_id and the 'admin' role.

DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- IMPORTANT: Replace 'your-admin-email@example.com' with the email of the user you want to make an admin.
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'your-admin-email@example.com';

    IF target_user_id IS NOT NULL THEN
        -- Insert the admin role for the user, and do nothing if the role already exists.
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;

        RAISE NOTICE 'User with email ''your-admin-email@example.com'' has been granted admin role.';
    ELSE
        RAISE WARNING 'User with email ''your-admin-email@example.com'' not found.';
    END IF;
END $$;

```

After running this script, you should be able to log in as the admin user and see the technician applications on the `/admin/applications` page.

### 4. Technician Login

The logic to block technician login unless their status is `APPROVED` is already correctly implemented in `src/services/technicianAuthService.ts`. No changes were needed there.
