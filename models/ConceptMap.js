import mongoose from "mongoose";

// Target element schema (maps source code to target codes)
const TargetElementSchema = new mongoose.Schema({
  code: { type: String, required: true },         // ICD entity URI
  display: { type: String, required: true },      // ICD title
  equivalence: {                                  // FHIR equivalence: equivalent, wider, narrower, etc.
    type: String,
    enum: ["equivalent", "wider", "narrower", "inexact", "unmatched", "disjoint"],
    default: "equivalent",
  },
  system: { type: String, enum: ["ICD11-TM2", "ICD11-MMS"], required: true },
}, { _id: false });

// Group schema (to support multiple source/target systems)
const ConceptMapGroupSchema = new mongoose.Schema({
  sourceSystem: { type: String, enum: ["NAMASTE"], required: true },
  targetSystem: { type: String, enum: ["ICD11-TM2", "ICD11-MMS"], required: true },
  elements: [{
    code: { type: String, required: true },        // Source code
    display: { type: String, required: true },     // Source display
    target: [TargetElementSchema],                 // List of target mappings
  }]
}, { _id: false });

// Main ConceptMap schema
const ConceptMapSchema = new mongoose.Schema({
  name: { type: String, required: true },          // ConceptMap name
  version: { type: String, default: "1.0.0" },     // Versioning
  description: { type: String },                   // Optional description
  groups: [ConceptMapGroupSchema],                // Multiple groups for source-target mappings
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.ConceptMap || mongoose.model("ConceptMap", ConceptMapSchema);
