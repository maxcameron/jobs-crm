
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the necessary types directly in the edge function
type CompanySector = 
  | "Artificial Intelligence (AI)"
  | "Fintech"
  | "HealthTech"
  | "E-commerce & RetailTech"
  | "Sales Tech & RevOps"
  | "HR Tech & WorkTech"
  | "PropTech (Real Estate Tech)"
  | "LegalTech"
  | "EdTech"
  | "Cybersecurity"
  | "Logistics & Supply Chain Tech"
  | "Developer Tools & Web Infrastructure"
  | "SaaS & Enterprise Software"
  | "Marketing Tech (MarTech)"
  | "InsurTech"
  | "GovTech"
  | "Marketplace Platforms"
  | "Construction Tech & Fintech"
  | "Mobility & Transportation Tech"
  | "CleanTech & ClimateTech";

function cleanAndParseJSON(text: string): any {
  // Remove any markdown code block syntax
  const cleanedText = text
    .replace(/```json\s*/, '')
    .replace(/```\s*$/, '')
    .replace(/```\s*/, '')
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.log('Attempted to parse text:', cleanedText);
    throw new Error('Failed to parse company data response');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      throw new Error('URL is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const prompt = `
You are a company research assistant. Given the URL ${url}, research the company and provide the following information in a JSON format, without any markdown formatting or code block syntax:

{
  "name": "Company name",
  "sector": One of these exact values: ["Artificial Intelligence (AI)", "Fintech", "HealthTech", "E-commerce & RetailTech", "Sales Tech & RevOps", "HR Tech & WorkTech", "PropTech (Real Estate Tech)", "LegalTech", "EdTech", "Cybersecurity", "Logistics & Supply Chain Tech", "Developer Tools & Web Infrastructure", "SaaS & Enterprise Software", "Marketing Tech (MarTech)", "InsurTech", "GovTech", "Marketplace Platforms", "Construction Tech & Fintech", "Mobility & Transportation Tech", "CleanTech & ClimateTech"],
  "subSector": "Specific sub-sector within the main sector",
  "fundingType": "Most recent funding round type (e.g., Seed, Series A, Series B, etc.)",
  "fundingDate": "Date of most recent funding (MM/YYYY format)",
  "fundingAmount": "Amount in USD of most recent funding (numbers only, no currency symbols)",
  "websiteUrl": "Company's website URL",
  "headquarterLocation": "City, State/Country format",
  "description": "2-3 sentences describing what the company does, focusing on their main product/service.",
  "tags": ["array", "of", "relevant", "technology", "or", "industry", "tags"]
}

Important: Return ONLY the JSON object, no markdown formatting or code block syntax.

Rules:
1. Use ONLY the predefined sector values from the list. Do not create new ones.
2. For fundingAmount, provide only numbers, no currency symbols or commas.
3. For dates, use MM/YYYY format.
4. Keep descriptions concise but informative.
5. Location should be in City, State/Country format.
6. Only include verified information you can find.
7. For subSector, be specific but brief.
8. Include 3-5 relevant tags.`;

    console.log('Sending request to OpenAI...');
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
            content: 'You are a precise company research assistant that returns only valid JSON without any markdown formatting or code blocks.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data.choices[0].message.content);
    
    const companyData = cleanAndParseJSON(data.choices[0].message.content);
    console.log('Parsed company data:', companyData);

    // Validate sector
    const validSectors: CompanySector[] = [
      "Artificial Intelligence (AI)", "Fintech", "HealthTech", "E-commerce & RetailTech",
      "Sales Tech & RevOps", "HR Tech & WorkTech", "PropTech (Real Estate Tech)",
      "LegalTech", "EdTech", "Cybersecurity", "Logistics & Supply Chain Tech",
      "Developer Tools & Web Infrastructure", "SaaS & Enterprise Software",
      "Marketing Tech (MarTech)", "InsurTech", "GovTech", "Marketplace Platforms",
      "Construction Tech & Fintech", "Mobility & Transportation Tech", "CleanTech & ClimateTech"
    ];

    if (!validSectors.includes(companyData.sector as CompanySector)) {
      console.error('Invalid sector:', companyData.sector);
      throw new Error(`Invalid sector: ${companyData.sector}. Must be one of: ${validSectors.join(", ")}`);
    }

    // Clean up and validate the data
    const cleanedData = {
      ...companyData,
      fundingAmount: companyData.fundingAmount.toString().replace(/[^0-9]/g, ''),
      fundingDate: companyData.fundingDate.replace(/^(\d{1})\//, '0$1/'),
      tags: Array.isArray(companyData.tags) ? companyData.tags.slice(0, 5) : [],
    };

    console.log('Cleaned data:', cleanedData);

    return new Response(JSON.stringify(cleanedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in research-company function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
