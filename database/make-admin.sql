-- Simple script to make a user an admin
-- Replace the email with your actual email address

UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT email, role FROM users WHERE email = 'your-email@example.com';







