export default function ProductLink({ itemLink }) {
  function validateURL(itemLink) {
    if (itemLink.startsWith("https://")) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      {itemLink === "" ? (
        <></>
      ) : (
        <div id="list-link">
          {validateURL(itemLink) ? (
            <a href={itemLink} target="_blank">
              Product Page
            </a>
          ) : (
            <a href={"https://" + itemLink} target="_blank">
              Product Page
            </a>
          )}
        </div>
      )}
    </>
  );
}
