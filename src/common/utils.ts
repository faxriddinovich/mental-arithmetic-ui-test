export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
  })
    .formatToParts(amount)
    .map((p) => (p.type != "literal" && p.type != "currency" ? p.value : ""))
    .join("");
}
