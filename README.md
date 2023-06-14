## LLM Finetune TS
Allows you to finetune an LLM (GPT3.5 by default) using .txt files. Based on [this python tutorial](https://www.haihai.ai/gpt-gdrive/) and [the Langchain docs](https://js.langchain.com/docs/) (which support natural language search). I failed to get this working in this Python repo but you're welcome to try that too.

## Getting Started
Set the `directoryPath` in `src/index.ts` to point to where your files are to finetune your LLM with (or add your `.txt` files to a `data` folder in this repo).

```
yarn install
yarn dev
yarn start
```
Now you can chat with your finetuned model in the CLI.

## Todo

- Add support for PDF files
- Add support for Google Drive files
- Explore using a [chat model](https://js.langchain.com/docs/getting-started/guide-chat)