const { Pinecone } = require('@pinecone-database/pinecone');

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error('Pinecone environment or api key vars missing');
}

async function initPinecone() {
  try {
    const pinecone = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT || '', // Use logical OR operator instead of nullish coalescing
      apiKey: process.env.PINECONE_API_KEY || '',
    });

    return pinecone;
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

// Asynchronous initialization is not supported in CommonJS, so you need to export the function instead
module.exports = initPinecone;
