import { Request, Response } from 'express';
import Update, { IUpdate } from '../models/Update';

export const createUpdate = async (req: Request, res: Response) => {
  try {
    const update = new Update({
      employeeName: req.body.employeeName,
      date: new Date(req.body.date),
      updates: req.body.updates,
      githubIssueLink: req.body.githubIssueLink,
      buildNumber: req.body.buildNumber,
    });

    const savedUpdate = await update.save();
    res.status(201).json(savedUpdate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUpdates = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const query = date ? { date: new Date(date as string) } : {};
    const updates = await Update.find(query).sort({ date: -1 });
    res.json(updates);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUpdateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = await Update.findById(id);
    
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }
    
    res.json(update);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedUpdate = await Update.findByIdAndUpdate(
      id,
      {
        employeeName: req.body.employeeName,
        updates: req.body.updates,
        githubIssueLink: req.body.githubIssueLink,
        buildNumber: req.body.buildNumber,
      },
      { new: true }
    );
    
    if (!updatedUpdate) {
      return res.status(404).json({ message: 'Update not found' });
    }
    
    res.json(updatedUpdate);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUpdate = await Update.findByIdAndDelete(id);
    
    if (!deletedUpdate) {
      return res.status(404).json({ message: 'Update not found' });
    }
    
    res.json({ message: 'Update deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 