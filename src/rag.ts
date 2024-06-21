import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { pull } from 'langchain/hub'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'

export async function retrieveAnswerFromRagChain(
  question: string,
): Promise<string> {
  const vectorStore = await Chroma.fromExistingCollection(
    new OpenAIEmbeddings(),
    {
      collectionName: process.env.CHROMADB_COLLECTION,
      url: process.env.CHROMADB_URL!,
    },
  )

  const retriever = vectorStore.asRetriever()
  const retrievedDocs = await retriever.invoke(question)

  const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt')
  const llm = new ChatOpenAI({
    model: process.env.OPENAI_LLM_MODEL,
    temperature: 0,
  })
  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  })

  const response = await ragChain.invoke({
    question,
    context: retrievedDocs,
  })

  return response
}
