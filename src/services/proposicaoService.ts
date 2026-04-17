import { API_BASE_URL } from "./api";

export async function getProposicoesPL2025ByDeputado(id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/proposicao/${id}/proposicoes`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar proposições");
    }

    return await response.json();
  } catch (error) {
    console.log("Erro proposições:", error);
    return [];
  }
}