
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

    const prompt = `I need accurate, factual information about the company at ${url}. 
    
IMPORTANT: You must ONLY return information that you can verify through the company's website or through reputable sources like:
- Crunchbase
- LinkedIn
- TechCrunch
- Bloomberg
- Reuters
- SEC filings
- Company press releases

Return the information in this JSON format:

{
  "name": "Company name (exactly as shown on their website)",
  "sector": One of these exact values: ["Artificial Intelligence (AI)", "Fintech", "HealthTech", "E-commerce & RetailTech", "Sales Tech & RevOps", "HR Tech & WorkTech", "PropTech (Real Estate Tech)", "LegalTech", "EdTech", "Cybersecurity", "Logistics & Supply Chain Tech", "Developer Tools & Web Infrastructure", "SaaS & Enterprise Software", "Marketing Tech (MarTech)", "InsurTech", "GovTech", "Marketplace Platforms", "Construction Tech & Fintech", "Mobility & Transportation Tech", "CleanTech & ClimateTech"],
  "subSector": "Specific focus area (e.g., SMB, Insurance, Enterprise)",
  "fundingType": "Most recent funding round (e.g., Pre-Seed, Seed, Series A, Series B, Series C)",
  "fundingDate": "Date of most recent funding in MM/YYYY format",
  "fundingAmount": "Most recent funding amount in USD, numbers only",
  "websiteUrl": "${url}",
  "headquarterLocation": "City, State/Country (e.g., San Francisco, CA)",
  "description": "Describe the company's main product/service in 20 words or less",
  "tags": ["array", "of", "relevant", "technology", "or", "industry", "tags"]
}

Critical rules:
1. The websiteUrl MUST be exactly "${url}" - do not change or modify it
2. Use ONLY the predefined sector values from the list
3. If you cannot find verified funding information, use "Not Disclosed" for fundingType, fundingDate, and 0 for fundingAmount
4. If you cannot verify any piece of information, use "Not Available" for text fields or [] for arrays
5. Description must be 20 words or less and based on their website/materials
6. For fundingAmount, provide only numbers, no currency symbols or commas
7. Include 3-5 relevant tags based on their actual technology/industry focus
8. NEVER generate or guess information - if you can't verify it, mark it as Not Available`;

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
            content: 'You are a precise research assistant that ONLY returns verified company information. Never generate or guess information. Return only valid JSON without any markdown formatting.' 
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

    // Validate that the returned URL matches the input URL
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
