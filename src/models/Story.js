import mongoose from "mongoose";

const StorySchema = new mongoose.Schema
({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    flowData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    visibility: { type: String, enum: ['private', 'public'], default: 'public' }
});

export default mongoose.models.Story || mongoose.model('Story', StorySchema);