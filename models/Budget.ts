import mongoose, { Schema } from 'mongoose';

const budgetSchema = new Schema({
    userId:     { type: String, required: true, unique: true },
    budgets:    {
        news:           { type: Number, default: 20 },
        social:         { type: Number, default: 30 },
        entertainment:  { type: Number, default: 60 },
        educational:    { type: Number, default: -1 },
        shopping:       { type: Number, default: 15 },
        forums:         { type: Number, default: 20 },
        gaming:         { type: Number, default: 30 },
        other:          { type: Number, default: -1 }
    },
    updatedAt:  { type: Date, default: Date.now }
});

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);