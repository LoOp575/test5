// Adapter LangGraph.js nyata — uncomment saat deps terinstall
// import { StateGraph, END, START } from "@langchain/langgraph";
// import { PVCWorkflow } from "./graph";
//
// Untuk MVP: re-export PVCWorkflow sebagai fallback
export { PVCWorkflow } from './graph';
export const isLangGraphAvailable = false;
