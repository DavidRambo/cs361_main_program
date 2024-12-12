# Wish List User Authorization and Data Backend

## Setup

Create and activate a virtual environment and then install the dependencies.
There are different options to do so, as the dependencies are listed in `pyproject.toml`, `requirements.txt`, and `uv.lock`.
With pip:

```bash
pip install -r requirements.txt
```

With [uv](https://docs.astral.sh/uv/guides/projects/):

```bash
uv sync
```

## Usage

To start the service, make sure a virtual environment is active with all dependencies installed, then, from the top-level directory, run:

```bash
fastapi run app/main.py
```

By default, fastapi runs on localhost port 8000.
The port can be set by passing `--port <PORT>` to the above command.

### Users API

### Gifts API

#### Parsing Text into Multiple Gifts

- Endpoint: `/gifts/parse-text`
- Method: POST

The data returned is an object with the key `data` and a value that is the JSON array of parsed gift ideas.
Thus, in order to access the JSON array in a response provided via the Fetch API, one would use `response.data.data`.

Each gift idea is separated by one or more blank lines, i.e. "\n\n".
A gift idea comprises three fields:

- what: required, it names the gift idea
- link: optional, a URL to the item or that explains it
- details: optional, additional information that may be relevant to the gift idea

Thus, an example submission string could be:

```
"""
t-shirt
size medium

Structure and Interpretation of Computer Programs
https://bookshop.org/p/books/structure-and-interpretation-of-computer-programs-gerald-jay-sussman/11620466?ean=9780262510875
2nd ed.
"""
```

The result would be:

```json
[
  { "what": "t-shirt", "link": null, "details": "size medium" },
  {
    "what": "Structure and Interpretation of Computer Programs",
    "link": "https://bookshop.org/p/books/structure-and-interpretation-of-computer-programs-gerald-jay-sussman/11620466?ean=9780262510875",
    "details": "2nd ed."
  }
]
```

The parser always treats the first line of a new paragraph as the "what".
It will determine whether the next additional non-blank line begins with "https://".
The rest of the lines will be included as details.
Thus, URLs may be included in the details portion of the gift idea as plain text.

#### Parsing a Wish List into Text

- Endpoint: `/gifts/parse-wishlist`
- Method: POST

The service also provides a route by which to convert a JSON array of gifts into plain text.

`POST http://localhost:8000/parse-json`

Since this is the reverse of the `parse-text` route, the request body should include an object with a key of `data` that has a value of the JSON array wish list.
It will return a JSON schema in the form:

```json
{
  "text": "A gift idea."
}
```

Thus, to extract the text in a Fetch API response, use `response.data.text`.
