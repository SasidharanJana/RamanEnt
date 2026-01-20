
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Project, Purchase } from "../types";

export const getBusinessInsights = async (products: Product[], projects: Project[], purchases: Purchase[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following business data for Raman Enterprises (Electrical & Road Contractor).
    Inventory: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.currentStock, min: p.minStock })))}
    Projects: ${JSON.stringify(projects.map(p => ({ name: p.name, budget: p.budget, status: p.status })))}
    Purchases: ${JSON.stringify(purchases.slice(-5))}

    Provide a professional summary including:
    1. Critical stock alerts.
    2. Financial health overview (GST liabilities and project spending).
    3. Operational suggestions for scaling.
    Keep it concise and business-focused.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Insights are currently unavailable. Please check your network connection.";
  }
};
