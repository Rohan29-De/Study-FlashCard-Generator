import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateFlashcards(text: string) {
  const prompt = `
    Analyze this text and generate a MASSIVE curriculum:
    1. "summary": A 4-sentence brilliant recap.
    2. "topics": List of 5 main themes.
    3. "concepts": 10 major ideas (title/content).
    4. "definitions": 15-20 essential terms (term/definition).
    5. "flashcards": 25-30 comprehensive cards (question/answer/explanation).
    6. "mcqs": 8-10 high-quality questions.
    7. "fillInBlanks": 8-10 items.

    TEXT: ${text.slice(0, 18000)}
  `;
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a master teacher who writes deep, comprehensive study kits. Always return valid JSON.' }, { role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    
    const content = completion.choices[0].message.content;
    if (!content) {
      console.error('No content returned from Groq API');
      return null;
    }
    
    const parsed = JSON.parse(content);
    
    // Validate that we have at least flashcards
    if (!parsed.flashcards || parsed.flashcards.length === 0) {
      console.error('No flashcards in AI response');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Groq API Error:', error);
    return null;
  }
}
