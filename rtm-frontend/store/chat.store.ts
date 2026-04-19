/* eslint-disable prefer-const */
type ChatState = {
  currentConveersationId: string | null;
}

let state: ChatState = {
  currentConveersationId: null,
};

export function setConversation(id: string) {
  state.currentConveersationId = id;
}

export function getConversation() {
  return state.currentConveersationId;
}