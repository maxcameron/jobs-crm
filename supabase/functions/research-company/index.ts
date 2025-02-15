
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

    const systemPrompt = `I'm building a CRM for job seekers. Here are the data points I want to capture for the companies:
- Company Name
 - ie Walmart
- Sector
 - ie Fintech, Marketplace, Procurement & Supply Chain, Sales Tech, AI
- Sub-Sector
 - ie SMB, Insurance, HR Tech, Enterprise, Consumer
- Funding Type
 - ie Pre-Seed, Seed, Series A, Series B, Series C, Venture
- Funding Date
 - expressed as month/year ie 02/2024 
- Funding Amount in USD
 - ie 16,000,000
- Website URL
 - ie https://google.com
- Headquarter location
 - ie San Francisco, New York, Paris, London
- Description
 - ie interviewing.io is a platform that helps engineers practice technical interviews anonymously and connect with top tech companies for real job opportunities.

Instructions:
- For each company URL, try to fill out all of the data points
- In addition to company websites, consult additional resources like TechCrunch, VentureBeat, Dealroom, Sifted, Tracxn, PitchBook, and TheSaaSNews while doing your research
- Description should be limited to 20 words or less
- If you find multiple funding rounds, show the most recent

Format your response as a JSON object with these exact keys:
{
  "name": "string",
  "sector": "string",
  "subSector": "string",
  "fundingType": "string",
  "fundingDate": "string",
  "fundingAmount": "string",
  "websiteUrl": "string",
  "headquarterLocation": "string",
  "description": "string"
}`;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: `Research this company: ${url}` 
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data));

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Unexpected response format from OpenAI API');
    }

    let companyData;
    try {
      companyData = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse GPT response:', data.choices[0].message.content);
      throw new Error('Failed to parse company data');
    }

    // Validate the required fields
    const requiredFields = [
      'name', 'sector', 'subSector', 'fundingType', 'fundingDate',
      'fundingAmount', 'websiteUrl', 'headquarterLocation', 'description'
    ];

    for (const field of requiredFields) {
      if (!companyData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return new Response(JSON.stringify(companyData), {
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
