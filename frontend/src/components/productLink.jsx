import { validateURL } from "../utils";

export default function ProductLink({ itemLink }) {
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
