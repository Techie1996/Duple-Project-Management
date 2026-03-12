import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

boardSchema.index({ project: 1, order: 1 });

export default mongoose.model('Board', boardSchema);

