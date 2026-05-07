import { Router } from "express";

import { registerShopDetails } from "../../controllers/auth/companyRegister.controller";
import { createUploader } from "../../config/multer";

const shopUpload = createUploader([
    {
        name: 'logo',
        maxCount: 1,
        mimeTypes: ['image/jpeg', 'image/png']
    }
]);


const shopRouter = Router();

shopRouter.post('/company', shopUpload,  registerShopDetails)



export default shopRouter;