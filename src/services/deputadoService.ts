import { API_BASE_URL } from "./api";

/**
 * Busca deputados por UF
 */
export async function getDeputadosPorUf(uf: string) {
  
  console.log("API",API_BASE_URL)
  try {
    const response = await fetch(
      `${API_BASE_URL}/deputados/estado/${uf}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar deputados por UF");
    }

    return await response.json();
  } catch (error) {
    console.error("getDeputadosPorUf:", error);
    throw error;
  }
}

/**
 * Busca detalhes de um deputado por ID
 */
export async function getDeputadoById(id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/deputados/${id}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar deputado");
    }

    return await response.json();
  } catch (error) {
    console.error("getDeputadoById:", error);
    throw error;
  }
}