import { Request, Response } from 'express';
import fs from 'fs';
import pdf from 'pdf-creator-node';

// services
import importsServices from '../services/importsServices';

const getImportPdfController = (request: Request, response: Response) => {
  if (fs.existsSync('./docs')) {
    fs.rmdirSync('./docs', { recursive: true });
  }

  const filename = Math.floor(Math.random() * 100 ** 5) + '_doc' + '.pdf';
  const html = fs.readFileSync('./src/views/index.html', 'utf-8');
  const data = importsServices.getData();

  const document = {
    html,
    data,
    type: 'pdf',
    path: './docs/' + filename,
  };

  const options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '10mm',
      contents: '<div style="text-align: center;"><h3>Personal Finance Report</h3></div>',
    },
  };

  pdf.create(document, options).then(() => {
    response.redirect('/docs/' + filename);
  });
};

export default {
  getImportPdfController,
};
