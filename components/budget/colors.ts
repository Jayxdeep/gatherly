export const CATEGORY_COLORS = [
  "#8c3f4c",
  "#2f6a4f",
  "#855a17",
  "#5b6b8a",
  "#7a5a7d",
  "#a3613e",
  "#4f7a78",
  "#6d6a5f",
];

export function categoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
