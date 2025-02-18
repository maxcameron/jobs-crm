
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

    const prompt = `Act as an expert company research analyst. Research the company at ${url} and provide ONLY a JSON response.

CRITICAL: Before responding:
1. Use CURRENT news sources and company announcements to find the MOST RECENT funding round
2. Cross-reference multiple sources (TechCrunch, VentureBeat, company press releases, Crunchbase, etc.)
3. Ensure you find the absolute latest funding information from 2024-2025
4. Be highly specific in the sub-sector classification and company description

Required format:
{
  "name": "Full company name (e.g., Stack AI)",
  "sector": "One of: Artificial Intelligence (AI), Fintech, HealthTech, E-commerce & RetailTech, Sales Tech & RevOps, HR Tech & WorkTech, PropTech (Real Estate Tech), LegalTech, EdTech, Cybersecurity, Logistics & Supply Chain Tech, Developer Tools & Web Infrastructure, SaaS & Enterprise Software, Marketing Tech (MarTech), InsurTech, GovTech, Marketplace Platforms, Construction Tech & Fintech, Mobility & Transportation Tech, CleanTech & ClimateTech",
  "subSector": "Be VERY specific (e.g., 'AI-Powered Enterprise Process Automation' rather than just 'Enterprise Automation')",
  "fundingType": "Most recent funding round. One of: Seed, Series A, Series B, Series C, Series D, Series E and above",
  "fundingDate": "Date of most recent funding in MM/YYYY format. Must be most current from 2024-2025 if available",
  "fundingAmount": "Amount in USD (e.g., 16100000). Must be from most recent round",
  "headquarterLocation": "City, State/Country (e.g., San Francisco, CA)",
  "description": "Clear, specific description focusing on unique value proposition and technology in 20 words or less"
}

CRITICAL RESEARCH STEPS:
1. First, search for funding announcements from 2024-2025
2. Check company newsroom or press releases
3. Verify details across multiple tech news sources
4. Cross-reference with investment databases
5. Ensure funding date and amount are from the MOST RECENT round only

Example of expected detail level:
{
  "name": "Stack AI",
  "sector": "Artificial Intelligence (AI)",
  "subSector": "Enterprise Process Automation & LLM-based Workflow Orchestration",
  "fundingType": "Series A",
  "fundingDate": "10/2024",
  "fundingAmount": "16100000",
  "headquarterLocation": "San Francisco, CA",
  "description": "LLM-powered platform deploying autonomous AI agents for end-to-end automation of complex enterprise workflows and operations."
}`;

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
            content: 'You are a company research analyst specializing in finding the most recent funding information and providing highly detailed company classifications. Always prioritize finding current (2024-2025) funding data. Return only valid JSON without any markdown formatting or additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2, // Even lower temperature for more focused research
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
