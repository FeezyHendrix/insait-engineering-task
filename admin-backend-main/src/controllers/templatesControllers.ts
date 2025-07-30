import { fetchAddTemplate, fetchAllTemplates, fetchDeleteTemplateById } from '../models/templatesModel';
import { RequestHandler } from 'express';
import tryCatch from '../utils/tryCatch';

export const addTemplate: RequestHandler = tryCatch(async (req, res) => {
  const payload = req.body.data ?? req.body;
  if (!payload || !payload.title || !payload.text) {
    return res.status(400).json({ error: 'Title and text are required' });
  }

  const newTemplate = await fetchAddTemplate(payload.title, payload.text);
  res.json(newTemplate);
});

export const getAllTemplates: RequestHandler = tryCatch(async (req, res) => {
    const data = await fetchAllTemplates();
    res.json(data);
});

export const deleteTemplateById: RequestHandler = tryCatch(async (req, res) => {
  const templateId = Number(req.params.templateId);
  await fetchDeleteTemplateById(templateId);
  res.json({ msg: "Deleted" });
});