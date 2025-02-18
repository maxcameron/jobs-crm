
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

    if (!url) {
      throw new Error('URL is required');
    }

    console.log('Researching URL:', url);

    const prompt = `You are a research assistant. Given the URL ${url}, provide detailed company information in a strict JSON format with these exact keys:
{
  "name": "Company name",
  "sector": "One of: Artificial Intelligence (AI), Fintech, HealthTech, E-commerce & RetailTech, Sales Tech & RevOps, HR Tech & WorkTech, PropTech (Real Estate Tech), LegalTech, EdTech, Cybersecurity, Logistics & Supply Chain Tech, Developer Tools & Web Infrastructure, SaaS & Enterprise Software, Marketing Tech (MarTech), InsurTech, GovTech, Marketplace Platforms, Construction Tech & Fintech, Mobility & Transportation Tech, CleanTech & ClimateTech",
  "subSector": "Specific focus area",
  "fundingType": "One of: Seed, Series A, Series B, Series C, Series D, Series E and above",
  "fundingDate": "MM/YYYY format",
  "fundingAmount": "Amount in USD",
  "headquarterLocation": "City name",
  "description": "20 words or less description"
}

Research using:
- Company website
- TechCrunch
- VentureBeat
- Dealroom
- Sifted
- Tracxn
- PitchBook
- The SaaS News

Return ONLY the JSON object, no other text. Ensure all values match the required formats exactly.`;

    console.log('Sending request to OpenAI...');

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
            content: 'You are a helpful assistant that researches companies and returns structured data in JSON format only, no additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI');
    }

    const result = data.choices[0].message.content;
    console.log('Raw result:', result);

    // Clean the response string to ensure it's valid JSON
    const cleanedResult = result.trim().replace(/```json\n?|\n?```/g, '');
    console.log('Cleaned result:', cleanedResult);

    // Parse the response as JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedResult);
      console.log('Parsed result:', parsedResult);
    } catch (e) {
      console.error('JSON parsing error:', e);
      console.error('Failed content:', cleanedResult);
      throw new Error('Invalid JSON format in AI response');
    }

    // Validate the required fields
    const requiredFields = ['name', 'sector', 'subSector', 'fundingType', 'fundingDate', 'fundingAmount', 'headquarterLocation', 'description'];
    for (const field of requiredFields) {
      if (!parsedResult[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
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
