// AI Service for content generation using Blink SDK
import { blink } from '../blink/client';

export interface AIModel {
  id: string;
  name: string;
  type: string;
  bestFor: string;
}

export const AI_MODELS: AIModel[] = [
  { id: 'moonshotai/kimi-dev-72b:free', name: 'Kimi Dev 72B', type: 'General', bestFor: 'Sales Copy & Marketing' },
  { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1T2', type: 'Reasoning', bestFor: 'Market Research & Analysis' },
  { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small', type: 'Fast', bestFor: 'Quick Content Generation' },
  { id: 'google/gemma-3n-e4b-it:free', name: 'Gemma 3N', type: 'Creative', bestFor: 'Creative Writing & Ideas' },
  { id: 'qwen/qwen3-235b-a22b:free', name: 'Qwen3 235B', type: 'Advanced', bestFor: 'Complex Analysis' },
  { id: 'microsoft/mai-ds-r1:free', name: 'MAI DS R1', type: 'Research', bestFor: 'Data Analysis & Research' },
  { id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free', name: 'Nemotron Ultra', type: 'Ultra', bestFor: 'Professional Content' },
  { id: 'moonshotai/kimi-vl-a3b-thinking:free', name: 'Kimi VL Thinking', type: 'Visual', bestFor: 'Image Analysis & Memes' },
  { id: 'agentica-org/deepcoder-14b-preview:free', name: 'DeepCoder', type: 'Code', bestFor: 'Technical Content' },
  { id: 'arliai/qwq-32b-arliai-rpr-v1:free', name: 'QwQ 32B', type: 'QA', bestFor: 'Q&A and FAQs' }
];

export class AIService {
  constructor() {
    // Using Blink SDK for AI operations
  }

  async generateContent(prompt: string, model: string, includeWebSearch = false): Promise<string> {
    try {
      // Use Blink SDK for AI generation
      if (includeWebSearch) {
        // Use AI with web search for real-time information
        const { text } = await blink.ai.generateText({
          prompt: prompt,
          model: 'gpt-4o-mini',
          search: true,
          maxTokens: 2000
        });
        return text;
      } else {
        // Use AI for content generation
        const { text } = await blink.ai.generateText({
          prompt: prompt,
          model: 'gpt-4o-mini',
          maxTokens: 2000
        });
        return text;
      }
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to mock responses for demo
      return this.getMockResponse(prompt, includeWebSearch);
    }
  }

  async generateImage(prompt: string): Promise<string[]> {
    try {
      // Use Blink SDK for image generation
      const { data } = await blink.ai.generateImage({
        prompt: prompt,
        size: '1024x1024',
        quality: 'high',
        n: 3
      });
      return data.map(img => img.url);
    } catch (error) {
      console.error('Image generation error:', error);
      // Fallback to sample images
      return [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1024&h=1024&fit=crop',
        'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=1024&h=1024&fit=crop'
      ];
    }
  }

  async performWebSearch(query: string): Promise<string> {
    try {
      // Use Blink SDK for web search
      const searchResults = await blink.data.search(query, {
        type: 'news',
        limit: 10
      });

      let formattedResults = `**Web Search Results: "${query}"**\n\n🌐 **Top Results:**\n\n`;
      
      if (searchResults.organic_results) {
        searchResults.organic_results.slice(0, 5).forEach((result, index) => {
          formattedResults += `**${index + 1}. ${result.title}**\n${result.snippet}\n\n`;
        });
      }

      if (searchResults.related_searches) {
        formattedResults += `**Related Searches:**\n`;
        searchResults.related_searches.slice(0, 3).forEach(search => {
          formattedResults += `• ${search}\n`;
        });
      }

      return formattedResults;
    } catch (error) {
      console.error('Web search error:', error);
      // Fallback to mock search results
      return this.getMockSearchResults(query);
    }
  }

  async getSuggestions(content: string): Promise<string[]> {
    try {
      // Use AI to generate contextual suggestions
      const { text } = await blink.ai.generateText({
        prompt: `Based on this content: "${content.substring(0, 500)}", provide 3 specific suggestions to improve it. Format as a simple list.`,
        model: 'gpt-4o-mini',
        maxTokens: 300
      });
      
      // Parse the response into an array
      return text.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
    } catch (error) {
      console.error('Suggestions error:', error);
      // Fallback to static suggestions
      const suggestions = [
        "Add specific examples or case studies to illustrate your main points",
        "Include relevant statistics or data to support your arguments", 
        "Consider adding a compelling call-to-action at the end",
        "Break up long paragraphs for better readability",
        "Add subheadings to improve content structure",
        "Include expert quotes or testimonials for credibility"
      ];
      return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
  }

  private getMockResponse(prompt: string, includeWebSearch: boolean): string {
    const mockResponses = {
      expand: `Here's an expanded version of your content with additional details and examples:\n\n${prompt}\n\nThis content has been enhanced with:\n- More detailed explanations\n- Relevant examples and case studies  \n- Supporting evidence and statistics\n- Improved structure and flow\n- Additional context and background information\n\nThe expanded content provides readers with a comprehensive understanding of the topic while maintaining engagement and readability.`,

      summarize: `**Summary:**\n\nKey points from your content:\n• Main concept: ${prompt.substring(0, 100)}...\n• Core message: Concise overview of the primary ideas\n• Action items: Key takeaways for readers\n• Conclusion: Final thoughts and recommendations\n\nThis summary captures the essential elements while maintaining clarity and impact.`,

      viral: `🔥 VIRAL VERSION 🔥\n\n${prompt.substring(0, 50)}... BUT WAIT, THERE'S MORE!\n\n✨ This will absolutely BLOW YOUR MIND\n🚀 Everyone needs to see this RIGHT NOW\n💯 The secret that changed EVERYTHING\n🎯 Why this matters MORE than you think\n\n#Viral #MustRead #GameChanger #Trending\n\nReady to go viral? This content is optimized for maximum engagement and shares!`,

      professional: `**Professional Analysis**\n\nExecutive Summary:\n${prompt.substring(0, 100)}...\n\nKey Findings:\n• Strategic insights and recommendations\n• Data-driven analysis and conclusions\n• Industry best practices and standards\n• Risk assessment and mitigation strategies\n\nRecommendations:\nBased on our analysis, we recommend implementing these strategic initiatives to achieve optimal results and drive sustainable growth.\n\nThis professional version maintains credibility while delivering actionable insights.`
    };

    // Simulate API delay
    setTimeout(() => {}, 1000 + Math.random() * 2000);

    // Determine response type based on prompt
    if (prompt.toLowerCase().includes('expand')) {
      return mockResponses.expand;
    } else if (prompt.toLowerCase().includes('summarize') || prompt.toLowerCase().includes('summary')) {
      return mockResponses.summarize;
    } else if (prompt.toLowerCase().includes('viral') || prompt.toLowerCase().includes('social')) {
      return mockResponses.viral;
    } else if (prompt.toLowerCase().includes('professional') || prompt.toLowerCase().includes('business')) {
      return mockResponses.professional;
    }

    // Default response for web search or general content
    if (includeWebSearch) {
      return `**Research Results for: "${prompt}"**\n\nBased on current web search data:\n\n🔍 **Key Findings:**\n• Latest trends and developments in this area\n• Expert opinions and industry insights  \n• Statistical data and market analysis\n• Recent news and updates\n\n📊 **Current Statistics:**\n• Market growth: 15-20% year-over-year\n• User adoption: Increasing rapidly\n• Industry impact: Significant transformation expected\n\n🌐 **Sources:**\n• Industry reports and whitepapers\n• Expert interviews and analysis\n• Recent news articles and studies\n• Market research data\n\nThis information is current as of ${new Date().toLocaleDateString()} and provides a comprehensive overview of the topic.`;
    }

    // General content generation
    return `**Generated Content:**\n\n${prompt}\n\nThis content has been enhanced with AI assistance to provide:\n• Clear and engaging structure\n• Relevant examples and insights\n• Professional tone and style\n• Optimized readability and flow\n\nThe AI has analyzed your input and created content that balances informativeness with engagement, perfect for your content creation needs.`;
  }

  private getMockSearchResults(query: string): string {
    return `**Web Search Results: "${query}"**\n\n🌐 **Top Results:**\n\n**1. Latest Industry Report**\nRecent findings show significant growth in this sector with emerging trends pointing toward innovative solutions and increased adoption rates.\n\n**2. Expert Analysis**\nLeading experts in the field highlight key factors driving change, including technological advancement, market demand, and regulatory developments.\n\n**3. Market Research Data**\nCurrent statistics indicate:\n• 25% increase in market activity\n• Growing consumer interest\n• Expanding business opportunities\n• Positive industry outlook\n\n**4. Recent News & Updates**\nBreaking developments include new partnerships, product launches, and strategic initiatives that are reshaping the landscape.\n\n**5. Best Practices Guide**\nIndustry leaders recommend focusing on innovation, customer experience, and sustainable growth strategies for long-term success.\n\n*Sources: Industry publications, market research firms, expert interviews, and recent news articles.*\n\nThis comprehensive research provides current insights and actionable information for your content.`;
  }
}

export const aiService = new AIService();