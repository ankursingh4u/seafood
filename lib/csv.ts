// CSV parsing utility — menu import
// Supports format: name,image_url,price,category
// `category` column is optional — omitting it leaves category unchanged

export interface CsvRow {
  name: string;
  image_url: string;
  price: number;
  category?: string;
}

export function parseCsv(csvText: string): CsvRow[] {
  const lines = csvText.trim().split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());

  const idx = {
    name:      headers.indexOf("name"),
    image_url: headers.indexOf("image_url"),
    price:     headers.indexOf("price"),
    category:  headers.indexOf("category"),
  };

  if (idx.name === -1 || idx.image_url === -1 || idx.price === -1) {
    throw new Error("CSV must have columns: name, image_url, price");
  }

  return rows
    .map((line) => {
      // Handle quoted fields (values may contain commas inside quotes)
      const cols = splitCsvLine(line);
      const name      = cols[idx.name]?.trim()      ?? "";
      const image_url = cols[idx.image_url]?.trim()  ?? "";
      const priceStr  = cols[idx.price]?.trim()      ?? "";
      const category  = idx.category >= 0 ? (cols[idx.category]?.trim() || undefined) : undefined;
      return { name, image_url, price: parseFloat(priceStr), category };
    })
    .filter((r) => r.name && r.image_url && !isNaN(r.price));
}

// Splits a CSV line respecting double-quoted fields
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
