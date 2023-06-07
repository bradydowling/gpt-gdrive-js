import { ChatOpenAI } from "langchain/chat_models";
import { RetrievalQAChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { Chroma } from "langchain/vectorstores";
import * as dotenv from 'dotenv';

dotenv.config();

const folder_id: string = '19fSU1VGdi-jyi4VlnkP8zzOw0SB7oHvb';
const loader = new TextLoader({
    folder_id: folder_id,
    recursive: false
});
const docs = loader.load();

const text_splitter: RecursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
    chunk_size: 4000,
    chunk_overlap: 0,
    separators: [" ", ",", "\n"]
});

const texts: any[] = text_splitter.split_documents(docs);
const embeddings: OpenAIEmbeddings = new OpenAIEmbeddings();
const db: Chroma = Chroma.from_documents(texts, embeddings);
const retriever: any = db.as_retriever();

const llm: ChatOpenAI = new ChatOpenAI({
    temperature: 0,
    model_name: "gpt-3.5-turbo"
});
const qa: RetrievalQA = RetrievalQA.from_chain_type({
    llm: llm,
    chain_type: "stuff",
    retriever: retriever
});

while (true) {
    const query: string = prompt("> ");
    const answer: any = qa.run(query);
    console.log(answer);
}