import mongoose from "mongoose";

const codeSystemSchema = new mongoose.Schema({
  resourceType: { type: String, default: "CodeSystem" },
  url: { type: String, required: true }, // e.g. http://namaste.gov.in/codesystem
  name: String,
  status: { type: String, default: "active" },
  concept: [
    {
      code: String,
      display: String,
      definition: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CodeSystem ||
  mongoose.model("CodeSystem", codeSystemSchema);
