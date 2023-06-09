import { ChatOpenAI } from "langchain/chat_models/openai";
import { RetrievalQAChain } from "langchain/chains";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import * as readline from "readline";
import * as dotenv from 'dotenv';
dotenv.config();

const cliPrompt = async (question: string) => {
  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readlineInterface.question(question, (answer) => {
      resolve(answer);
      readlineInterface.close();
    });
  });
}

const directoryPath = "/Users/brady/Dev/overcoming-pornography/data";
const loader = new DirectoryLoader(directoryPath, {
  ".txt": (path) => new TextLoader(path),
});

const docs = await loader.load();


const text_splitter: RecursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 0,
    separators: [" ", ",", "\n"]
});

const texts = await text_splitter.splitDocuments(docs);
const embeddings: OpenAIEmbeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

const vectorStore = await HNSWLib.fromDocuments(texts, embeddings);
const retriever = vectorStore.asRetriever();

const llm: ChatOpenAI = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo"
});
const qa = RetrievalQAChain.fromLLM(llm, retriever);

while (true) {
    const query = await cliPrompt("> ");
    const answer: any = await qa.run(query);
    console.log(answer);
}