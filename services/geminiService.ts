import { GoogleGenAI } from "@google/genai";
import { MENU_ITEMS } from "../constants";

let aiClient: GoogleGenAI | null = null;

// Initialize strictly with process.env.API_KEY
if (process.env.API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  if (!aiClient) {
    return "I'm sorry, my AI brain is currently offline (API Key missing). Please contact the restaurant directly.";
  }

  try {
    const menuContext = MENU_ITEMS.map(item => 
      `${item.name} ($${item.price}): ${item.description} [${item.isVeg ? 'Veg' : 'Non-Veg'}, ${item.isSpicy ? 'Spicy' : 'Mild'}]`
    ).join('\n');

    const systemInstruction = `
      You are "CurryBot", the friendly and helpful AI concierge for the restaurant "Curries & Burger".
      
      Your Role:
      1. Help customers choose dishes based on their preferences (spicy, veg, budget, etc.).
      2. Explain menu items using the provided menu context.
      3. Be polite, enthusiastic, and brief.
      4. If asked about reservations or orders, guide them to use the buttons on the website.
      
      Menu Context:
      ${menuContext}
      
      Current Store Info:
      - We are open 11 AM - 10 PM daily.
      - We have 2 locations: Downtown and Westside.
      
      Do not make up menu items not listed above.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm not sure how to answer that right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server. Please try again later.";
  }
};
