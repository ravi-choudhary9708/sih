import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";

import Code from "../models/Code.js";
import ConceptMap from "../models/ConceptMap.js";



async function main() {
  await mongoose.connect("mongodb+srv://knowledgemithila:dZoJG5cJk1fwlBrJ@cluster0.nt7tte1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  console.log("🚀 Connected to MongoDB");

  const codes = [];

  fs.createReadStream("./data/namasteSample.csv")
    .pipe(csv())
    .on("data", (row) => {
      console.log("hb",row)
      codes.push({
        system: "NAMASTE",
        code: row.code,
        display: row.term,
        description: row.description
      });
    })
    .on("end", async () => {
      await Code.deleteMany({ system: "NAMASTE" });
      await Code.insertMany(codes);
      console.log(`✅ Inserted ${codes.length} NAMASTE codes`);

      await ConceptMap.deleteMany({});
      await ConceptMap.insertMany([
        { sourceCode: "ASU001", targetCode: "TM2-567", display: "Prameha → Diabetes (TM2)" }
      ]);
      console.log("✅ Inserted demo ConceptMap");

      mongoose.disconnect();
    });
}

main();
