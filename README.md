A simple json viewer, running entirely in the browser, in a backend-free world :raised_hands:.

## Getting started

```
git clone https://github.com/tbourrely/json-viewer.git
cd json-viewer
pnpm i
pnpm run dev
```

## Running tests

```
pnpm run test
```

## Running linters

```
pnpm run lint
```

## Docker

```
docker build -t json-viewer .
docker run -p 8000:8000 -it --rm json-viewer
```

## Adding json files

Simply add json files in the *assets* directory.

> example json files were generated through ChatGPT.

## Dependencies

Built with:
* [svelte](https://svelte.dev/)
* [svelteflow](https://svelteflow.dev/)
* [dagre](https://github.com/dagrejs/dagre)
