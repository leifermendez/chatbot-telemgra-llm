const { CoreClass } = require('@bot-whatsapp/bot');


class ChatGPTClass extends CoreClass {

  constructor(_database, _provider) {
    super(null, _database, _provider)

  }

  handleMsg = async (ctx) => {
    const state = {
      getMyState: this.stateHandler.getMyState(ctx.from),
      get: this.stateHandler.get(ctx.from),
      getAllState: this.stateHandler.getAllState,
      update: this.stateHandler.updateState(ctx),
      clear: this.stateHandler.clear(ctx.from),
    }

    const { from, body } = ctx

    const conversationList = state.getMyState()?.conversationList ?? []

    const apiRaw = await fetch(`https://l4fvdw9b-8787.uks1.devtunnels.ms/chat/llama-qa`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Leifer',
        message: body
      })
    })

    const interaccionChatGPT = await apiRaw.json()

    conversationList.push(interaccionChatGPT);
    const parseMessage = {
      ...interaccionChatGPT,
      answer: interaccionChatGPT
    }

    await state.update({ threadId: null, conversationList })

    this.sendFlowSimple([parseMessage], from)
  }
}

module.exports = ChatGPTClass;