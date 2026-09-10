export interface ToolDefinition {
    type:"function";
    name:string;
    description:string;
    parameters:Record<string, unknown>;
    strict?:boolean
}

export type ToolExecutor =(
    agrs:unknown
)=>Promise<string>;
