const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const connect = require("../pinecone/connect");
const { chainIntent } = require("./index");

/**
 * 
 * @param {*} history 
 * @param {*} question 
 * @returns 
 */
const runChat = async (
    history = [],
    question,
) => {
    const pinecone = await connect()
    const index = pinecone.Index(`${process.env.PINECONE_INDEX_NAME}`);

    const pastMessages = history.map((message) => {
        if (message.role === "assistant") {
            return `AI: ${message.content}\n` //AI: te recomiendo aprender..
        }
        if (message.role === "user") {
            return `Human: ${message.content}\n`  //Human: quiero un curso sobre node
        }
    }).join('\n')


    const loadedVectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
            pineconeIndex: index,
            textKey: "text",
        }
    );

    const chain = chainIntent(loadedVectorStore);
    const sanitizedQuestion = question.trim().replace("\n", " ");

    const response = await chain.invoke({
        question: sanitizedQuestion,
        chatHistory: pastMessages
    });

    return { response };
};


module.exports = { runChat }