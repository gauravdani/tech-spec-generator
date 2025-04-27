import { Request, Response } from 'express';
import { Spec } from '../models/Spec';
import { generateSpecification } from '../services/claude';
import { AppError } from '../middleware/errorHandler';

export const specController = {
  async generate(req: Request, res: Response) {
    try {
      const formData = req.body;
      
      if (!formData.businessType || !formData.selectedEvents?.length) {
        throw new AppError('Missing required fields', 400);
      }

      const specification = await generateSpecification(formData);
      
      // Save the specification
      const spec = new Spec({
        ...formData,
        specification,
      });
      await spec.save();

      res.json({ 
        id: spec._id,
        specification 
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to generate specification', 500);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const specs = await Spec.find()
        .sort({ createdAt: -1 })
        .limit(10);
      res.json(specs);
    } catch (error) {
      throw new AppError('Failed to fetch specifications', 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const spec = await Spec.findById(req.params.id);
      if (!spec) {
        throw new AppError('Specification not found', 404);
      }
      res.json(spec);
    } catch (error) {
      throw new AppError('Failed to fetch specification', 500);
    }
  }
}; 