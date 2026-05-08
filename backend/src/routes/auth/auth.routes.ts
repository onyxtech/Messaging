// routes/auth.routes.ts
import { Router } from "express";
import { registerShopDetails } from "../../controllers/auth/companyRegister.controller";
import { login, setupPassword } from "../../controllers/auth/login.controller";
import { verifyEmail, resendVerificationEmail } from "../../controllers/auth/verification.controller";
import { createUploader } from "../../config/multer";

const router = Router();

// Multer configuration for logo upload
const shopUpload = createUploader([
    {
        name: 'logo',
        maxCount: 1,
        mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    }
]);

// Auth routes
router.post('/register/company', shopUpload, registerShopDetails);
router.post('/auth/login', login);
router.put('/auth/setup-password', setupPassword)
router.get('/auth/verify-email', verifyEmail);
router.post('/auth/resend-verification', resendVerificationEmail);

export default router;