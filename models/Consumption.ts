import mongoose, { Schema } from 'mongoose';

const consumptionSchema = new Schema({
    userId:     { type: String, required: true },
    date:       { type: String, required: true }, // YYYY-MM-DD
    category:   { type: String, required: true },
    minutes:    { type: Number, required: true, default: 0 },
    domain:     { type: String, required: true },
    createdAt:  { type: Date, default: Date.now }
});

// Index for fast lookups by user and date
consumptionSchema.index({ userId: 1, date: 1, category: 1 });

export default mongoose.models.Consumption || mongoose.model('Consumption', consumptionSchema);