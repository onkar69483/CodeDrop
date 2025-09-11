import Groq from 'groq-sdk';
import { env } from '$env/dynamic/private';

const groq = new Groq({
  apiKey: env.GROQ_API_KEY
});

export async function moderateContent(title, text) {
  const apiKey = env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('Content moderation service unavailable - API key missing');
  }

  try {
    const prompt = `You are a strict multilingual content moderator. Analyze the following content for ANY inappropriate material including:
- Explicit sexual content, innuendos, or suggestive language
- Profanity, vulgar language, or offensive terms
- Hate speech, harassment, or discriminatory content
- Adult content, fetishes, or sexual references
- Inappropriate body part references or sexual suggestions
- Any content that would be unsuitable for a professional environment

Analyze content in ANY language including English, Hindi, and other languages.

Title: "${title}"
Content: "${text}"

Be STRICT in your evaluation. If there's any doubt about appropriateness, err on the side of caution.

Respond with only "APPROPRIATE" if the content is completely safe and professional, or "INAPPROPRIATE: [brief reason]" if it contains any problematic content.`;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 100
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    if (response?.startsWith('INAPPROPRIATE:')) {
      return {
        isAppropriate: false,
        reason: response.replace('INAPPROPRIATE:', '').trim()
      };
    }
    
    return { isAppropriate: true, reason: null };
    
  } catch (error) {
    throw new Error('Content moderation service temporarily unavailable. Please try again later.');
  }
}
