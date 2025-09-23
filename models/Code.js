import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  system: { type: String, enum: ["NAMASTE", "ICD11"], required: true },
  code: { type: String, required: true, index: true },
  display: { type: String, required: true },                   // NAMC_term
  display_diacritical: String,                                  // NAMC_term_diacritical
  display_devanagari: String,                                   // NAMC_term_DEVANAGARI
  short_description: String,                                    // Short_definition
  long_description: String,                                     // Long_definition
  ontology: String,                                             // Ontology_branches
  alt_names: {                                                  // English variants
    english: String,                                            // Name English
    under_index: String,                                        // Name English Under Index
    primary_related: String                                     // Primary Index Related
  },
  version: { type: String, default: "uploaded" },
  meta: Object,                                                 // optional metadata for FHIR compliance
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Code || mongoose.model("Code", CodeSchema);
