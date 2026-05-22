import { GoogleGenAI } from "@google/genai";

export const generateLogo = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "A premium, elegant logo for 'Rasi Bakery'. The logo should feature a stylized cupcake or a chef's hat with a rolling pin, using a warm color palette of chocolate brown, cream, and a hint of gold. The typography should be a sophisticated serif font. Minimalist and modern design, suitable for a high-end bakery website. White background.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
