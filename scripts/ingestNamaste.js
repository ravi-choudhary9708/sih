import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import mongoose from "mongoose";
import Fuse from "fuse.js";
import dotenv from "dotenv";
import Code from "@/models/Code.js";
import ConceptMap from "@/models/ConceptMap.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI ;

async function loadICD() {
  const p = process.env.ICD11_SNAPSHOT_PATH || path.join("data", "icd11_snapshot.json");
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

async function ingestCSV() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const icd = await loadICD();
  const fuse = new Fuse(icd, { keys: ["display"], threshold: 0.4 });

  const csvPath = path.join("data", "namaste_sample.csv");
  const content = fs.readFileSync(csvPath, "utf8");

  parse(content, { columns: true, trim: true }, async (err, records) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    await Code.deleteMany({});
    await ConceptMap.deleteMany({});

    for (const r of records) {
      const entry = new Code({
        system: "NAMASTE",
        code: r.code,
        display: r.term,
        description: r.description || "",
        version: "demo-1"
      });
      await entry.save();

      const res = fuse.search(r.term);
      if (res.length) {
        const best = res[0].item;
        const cm = new ConceptMap({
          sourceSystem: "NAMASTE",
          sourceCode: r.code,
          targetSystem: "ICD11",
          targetCode: best.code,
          equivalence: "related",
          confidence: 0.8,
          provenance: { createdBy: "ingest-script", createdAt: new Date().toISOString() }
        });
        await cm.save();
      }
    }

    console.log("✅ Ingest complete.");
    mongoose.disconnect();
  });
}

ingestCSV();
