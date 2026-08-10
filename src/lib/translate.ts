export const translateText = async (text: string): Promise<string> => {
  if (!text) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    
    // Google Translate splits the text into sentences/paragraphs. We need to join them.
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('') || text;
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
