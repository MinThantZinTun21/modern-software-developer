import { routerRequest } from "./router";
import { handleGeneral, handleRefund, handleTechnical, handleComplex } from "./workflow/general";

export async function agent(message: string): Promise<string> {
  const routerResult = await routerRequest(message);
  switch (routerResult.category) {
    case "GENERAL":
      return await handleGeneral(message);
    case "REFUND":
      return await handleRefund(message);
    case "TECHNICAL":
      return await handleTechnical(message);
    case "COMPLEX":
      return await handleComplex(message);
  }
}
