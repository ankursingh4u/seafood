// CSV parsing utility — used by Dev C for menu import
// Parses uploaded CSV with format: name,image_url,price

import { MenuItem } from "@/types/menu";

export interface CsvRow {
  name: string;
  image_url: string;
  price: number;
}

export function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText.trim().split("\n");
  const [_header, ...rows] = lines;

  return rows.map((line) => {
    const [name, image_url, price] = line.split(",").map((v) => v.trim());
    return {
      name,
      image_url,
      price: parseFloat(price),
    };
  });
}
