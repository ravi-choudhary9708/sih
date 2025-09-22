import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose.js";
import Bundle from "@/models/Bundle";

export async function GET() {
  await connectDB();

  // Count top NAMASTE codes in bundles
  const pipeline = [
    { $unwind: "$bundle.entry" },
    { $match: { "bundle.entry.resource.code.coding.system": "NAMASTE" } },
    {
      $group: {
        _id: "$bundle.entry.resource.code.coding.display",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ];

  const results = await Bundle.aggregate(pipeline);
  return NextResponse.json({
    topCodes: results.map(r => ({ display: r._id, count: r.count }))
  });
}
