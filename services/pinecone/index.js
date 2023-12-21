const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { pinecone } = require("./connect");

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || '';

/**
 * 
 * @param {*} docs 
 * @returns 
 */
const runOnPinecone = async (docs = []) => {
    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        textKey: "text",
    });

    return true;
};

module.exports = { runOnPinecone };
