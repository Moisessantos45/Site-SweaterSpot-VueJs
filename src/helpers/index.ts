export const formatCurrency = (amount: number | string): string =>
  Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

export const createFormattedDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const validateIsNumber = (value: string) => {
  return Number.isNaN(Number(value));
};
