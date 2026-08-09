export const translateText = async (text: string): Promise<string> => {
  if (!text) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0][0][0] || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
