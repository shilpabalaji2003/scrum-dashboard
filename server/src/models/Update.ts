import mongoose, { Schema, Document } from 'mongoose';

export interface IUpdate extends Document {
  employeeName: string;
  date: Date;
  updates: string;
  githubIssueLink?: string;
  issueDescription?: string;
  buildNumber?: string;
  issueStatus: 'N/A' | 'Opened' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const UpdateSchema: Schema = new Schema({
  employeeName: { type: String, required: true },
  date: { type: Date, required: true },
  updates: { type: String, required: true },
  githubIssueLink: { type: String },
  issueDescription: { type: String },
  buildNumber: { type: String },
  issueStatus: { 
    type: String, 
    enum: ['N/A', 'Opened', 'Closed'],
    default: 'N/A'
  }
}, {
  timestamps: true,
  expires: 2592000 // Document will be automatically deleted after 30 days (in seconds)
});

export default mongoose.model<IUpdate>('Update', UpdateSchema); 