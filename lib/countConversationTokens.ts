import {encodingForModel} from 'js-tiktoken'

const enc = encodingForModel("gpt-4o-mini");

export function countTokens(text: string): number {
  return enc.encode(text).length;
}

export function countConversationTokens(messages: {role: string, content: string}[]){
  let tokens = 0;

  for(const msg of messages){
    tokens += 4;
    tokens += countTokens(msg.content);
  }

  tokens += 2;

  return tokens;
}