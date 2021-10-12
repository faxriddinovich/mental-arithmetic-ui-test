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

export function fsBucketFactory(id: string) {
  return process.env.VUE_APP_FS_BUCKET_URL + "/" + id;
}
