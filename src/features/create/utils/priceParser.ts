export const parseSmartPrice = (value: string | number): number => {
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (!value) return 0;

  const sanitized = value.trim().toLowerCase().replace(/,/g, ".");

  // Xử lý đuôi 'k' (ví dụ: 10k -> 10000, 1.5k -> 1500)
  if (sanitized.endsWith("k")) {
    const num = parseFloat(sanitized.slice(0, -1));
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }

  // Xử lý đuôi 'm' (ví dụ: 1m -> 1000000, 1.5m -> 1500000)
  if (sanitized.endsWith("m")) {
    const num = parseFloat(sanitized.slice(0, -1));
    return isNaN(num) ? 0 : Math.round(num * 1000000);
  }

  // Xử lý số thuần túy có dấu phân cách
  const rawNum = parseFloat(sanitized.replace(/[^0-9.]/g, ""));
  return isNaN(rawNum) ? 0 : rawNum;
};
