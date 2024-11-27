export function validateURL(itemLink) {
  if (itemLink.startsWith("https://")) {
    return true;
  } else {
    return false;
  }
}
