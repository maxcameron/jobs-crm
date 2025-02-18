
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // First, let's get the company website content
    console.log('Fetching website content...');
    const websiteResponse = await fetch(url);
    const websiteContent = await websiteResponse.text();
    
    const prompt = `You are a precise company research assistant. I need you to analyze this company website content and provide accurate information.

Website URL: ${url}
Website Content: """${websiteContent}"""

VERY IMPORTANT RULES:
1. ONLY use information directly visible in the provided website content
2. If you cannot find specific information in the website content, use "Not Available" or "Not Disclosed"
3. DO NOT make assumptions or generate information
4. DO NOT use external sources - ONLY use the provided website content

Return a JSON object with these fields:
{
  "name": "Company name (exactly as shown on their website)",
  "sector": One of these exact values: ["Artificial Intelligence (AI)", "Fintech", "HealthTech", "E-commerce & RetailTech", "Sales Tech & RevOps", "HR Tech & WorkTech", "PropTech (Real Estate Tech)", "LegalTech", "EdTech", "Cybersecurity", "Logistics & Supply Chain Tech", "Developer Tools & Web Infrastructure", "SaaS & Enterprise Software", "Marketing Tech (MarTech)", "InsurTech", "GovTech", "Marketplace Platforms", "Construction Tech & Fintech", "Mobility & Transportation Tech", "CleanTech & ClimateTech"],
  "subSector": "Specific focus area from website (e.g., SMB, Insurance, Enterprise)",
  "fundingType": "Not Disclosed",
  "fundingDate": "Not Disclosed",
  "fundingAmount": "0",
  "websiteUrl": "${url}",
  "headquarterLocation": "Location if shown on website, otherwise Not Available",
  "description": "Main product/service description in 20 words or less from website content",
  "tags": ["3-5 relevant tags based on website content"]
}

For the sector field, choose the MOST appropriate category from the provided list based on the website content.`;

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
            content: 'You are a precise research assistant. Only use information directly from the provided website content. Never make assumptions or generate information. Only return valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
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

    // Validate URL
    if (companyData.websiteUrl !== url) {
      throw new Error('OpenAI returned data for wrong company URL');
    }

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
      fundingDate: companyData.fundingDate === "Not Disclosed" ? "Not Disclosed" : companyData.fundingDate.replace(/^(\d{1})\//, '0$1/'),
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
