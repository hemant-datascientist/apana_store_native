/**
 * Formats a number into a human-readable string using Indian locale
 * and abbreviations for Thousands (k) and Millions (M).
 * 
 * Example:
 * 12500000 -> 12.5M
 * 450000   -> 450k
 * 1200     -> 1.2k
 * 410      -> 410
 */
export const formatCount = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toLocaleString("en-IN");
};
