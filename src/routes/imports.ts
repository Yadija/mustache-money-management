import express from 'express';

// controllers
import importsController from '../controllers/importsController';

const importsRouter = express.Router();
importsRouter.get('/pdf', importsController.getImportPdfController);

export default importsRouter;
