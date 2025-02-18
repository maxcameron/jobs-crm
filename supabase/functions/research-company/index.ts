
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    const prompt = `I'm working on a table called Companies with the following columns:
- Company Name
 - ie Walmart
- Sector
 - ie Fintech, Marketplace, Procurement & Supply Chain, Sales Tech, AI
- Sub-Sector
 - ie SMB, Insurance
- Funding Type
 - ie Pre-Seed, Seed, Series A, Series B, Series C, Series D, Venture
- Funding Date
 - expressed as month/year ie 02/2024 
- Funding Amount in USD
 - ie $16,000,000
- Website URL
 - ie https://google.com
- Headquarter location
 - ie San Francisco, New York, Paris, London
- Description
 - ie interviewing.io is a platform that helps engineers practice technical interviews anonymously and connect with top tech companies for real job opportunities.

Instructions:
- For the URL ${url}, try to fill out all of the columns 
- Return results in JSON
- In addition to company websites, consult these resources while doing your research:
  - https://techcrunch.com
  - https://venturebeat.com
  - https://dealroom.co
  - https://sifted.eu 
  - https://tracxn.com/
  - https://pitchbook.com/
  - https://www.thesaasnews.com/
- Description should be limited to 20 words or less
- If you find multiple funding rounds, show the most recent`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that researches companies and returns structured data in JSON format.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the response as JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', result);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in research-company function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
