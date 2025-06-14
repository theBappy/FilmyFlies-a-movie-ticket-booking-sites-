export const ISOTimeFormat = (dateTime) => {
  const date = new Date(dateTime);
  const localTime = date.toLocaleString(`en-US`, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return localTime;
};
