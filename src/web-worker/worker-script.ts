import { Document, webWorkerContext } from './worker-proxy';
import type { InitializeScriptData } from '../types';
import { logWorker } from '../utils';

export const initMainScriptsInWebWorker = (
  doc: Document,
  initializeScripts: InitializeScriptData[]
) => {
  initializeScripts.forEach((initializeScript) => {
    if (initializeScript.$url$) {
      initializeScriptUrl(doc, initializeScript.$instanceId$, initializeScript.$url$);
    } else if (initializeScript.$content$) {
      initializeScriptContent(doc, initializeScript.$instanceId$, initializeScript.$content$);
    }
  });
};

const initializeScriptContent = (doc: Document, instanceId: number, scriptContent: string) => {
  try {
    logWorker(`Run script content [data-partytown-id="${instanceId}"]`);
    webWorkerContext.$currentScript$ = instanceId;
    const runScript = new Function(scriptContent);
    runScript();
    webWorkerContext.$currentScript$ = -1;
  } catch (e) {
    console.error(`Party foul`, e, '\n' + scriptContent);
  }
};

const initializeScriptUrl = (doc: Document, instanceId: number, scriptUrl: string) => {
  try {
    logWorker(`Run script url [data-partytown-id="${instanceId}"] - ${scriptUrl}`);
    importScriptUrl(doc, scriptUrl, instanceId);
  } catch (e) {
    console.error(`Party foul`, e, '\n' + scriptUrl);
  }
};

export const importScriptUrl = (doc: Document, scriptUrl: string, instanceId?: number) => {
  webWorkerContext.$currentScript$ = instanceId;
  webWorkerContext.$importScripts$(scriptUrl);
  webWorkerContext.$currentScript$ = -1;
};