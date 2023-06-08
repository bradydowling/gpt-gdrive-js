import { ChatOpenAI } from "langchain/chat_models/openai";
import { RetrievalQAChain } from "langchain/chains";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores";
import * as dotenv from 'dotenv';
dotenv.config();

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
const db: Chroma = await Chroma.fromDocuments(texts, embeddings, {});
const retriever: any = db.asRetriever();

const llm: ChatOpenAI = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo"
});
const qa = RetrievalQAChain.fromLLM(llm, retriever);

while (true) {
    const query = prompt("> ");
    const answer: any = await qa.run(query);
    console.log(answer);
}