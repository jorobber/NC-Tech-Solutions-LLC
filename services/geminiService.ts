
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const getBusinessAdvice = async (data: any) => {
  const ai = getAIClient();
  const prompt = `
    Analiza los siguientes datos de mi negocio de carnes asadas (la moneda es Lempiras, símbolo L):
    ${JSON.stringify(data)}
    
    Proporciona 3 consejos estratégicos para mejorar las ventas, reducir costos o mejorar el margen de ganancia. 
    Asegúrate de usar el símbolo 'L' para cualquier referencia monetaria.
    Responde en formato JSON con la siguiente estructura:
    {
      "advice": [
        {"title": "string", "description": "string", "impact": "Alto|Medio|Bajo"}
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["title", "description", "impact"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { advice: [] };
  }
};
