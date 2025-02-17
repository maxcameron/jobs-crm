
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map common sectors to our enum values
const sectorMapping: { [key: string]: string } = {
  "Real Estate": "PropTech (Real Estate Tech)",
  "PropTech": "PropTech (Real Estate Tech)",
  "Real Estate Tech": "PropTech (Real Estate Tech)",
  "AI": "Artificial Intelligence (AI)",
  "Artificial Intelligence": "Artificial Intelligence (AI)",
  "Finance": "Fintech",
  "Financial Technology": "Fintech",
  "Health": "HealthTech",
  "Healthcare": "HealthTech",
  "E-commerce": "E-commerce & RetailTech",
  "Retail": "E-commerce & RetailTech",
  "Sales": "Sales Tech & RevOps",
  "HR": "HR Tech & WorkTech",
  "Human Resources": "HR Tech & WorkTech",
  "Legal": "LegalTech",
  "Education": "EdTech",
  "Security": "Cybersecurity",
  "Cyber Security": "Cybersecurity",
  "Logistics": "Logistics & Supply Chain Tech",
  "Supply Chain": "Logistics & Supply Chain Tech",
  "Developer": "Developer Tools & Web Infrastructure",
  "Web Infrastructure": "Developer Tools & Web Infrastructure",
  "SaaS": "SaaS & Enterprise Software",
  "Enterprise": "SaaS & Enterprise Software",
  "Marketing": "Marketing Tech (MarTech)",
  "MarTech": "Marketing Tech (MarTech)",
  "Insurance": "InsurTech",
  "Government": "GovTech",
  "Marketplace": "Marketplace Platforms",
  "Construction": "Construction Tech & Fintech",
  "Mobility": "Mobility & Transportation Tech",
  "Transportation": "Mobility & Transportation Tech",
  "Climate": "CleanTech & ClimateTech",
  "Clean Tech": "CleanTech & ClimateTech",
};

const systemPrompt = `I'm building a CRM for job seekers. Here are the data points I want to capture for the companies:
- Company Name
 - ie Walmart
- Sector
 - ie Fintech, Marketplace, PropTech (Real Estate Tech), Sales Tech & RevOps, Artificial Intelligence (AI)
- Sub-Sector
 - ie SMB, Insurance, HR Tech, Enterprise, Consumer
- Funding Type
 - ie Pre-Seed, Seed, Series A, Series B, Series C, Series D, Series E or Later
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
- IMPORTANT: Return the data in valid JSON format with these exact keys:
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
}

For sectors, use ONLY these exact values:
- Artificial Intelligence (AI)
- Fintech
- HealthTech
- E-commerce & RetailTech
- Sales Tech & RevOps
- HR Tech & WorkTech
- PropTech (Real Estate Tech)
- LegalTech
- EdTech
- Cybersecurity
- Logistics & Supply Chain Tech
- Developer Tools & Web Infrastructure
- SaaS & Enterprise Software
- Marketing Tech (MarTech)
- InsurTech
- GovTech
- Marketplace Platforms
- Construction Tech & Fintech
- Mobility & Transportation Tech
- CleanTech & ClimateTech`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required environment variables are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: `Research this company: ${url}. Return ONLY the JSON object, no other text.` 
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
      // Add more detailed logging
      console.log('Raw GPT response:', data.choices[0].message.content);
      
      // Try to extract JSON if it's wrapped in backticks or has extra text
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        companyData = JSON.parse(jsonMatch[0]);
      } else {
        companyData = JSON.parse(content);
      }
      
      console.log('Parsed company data:', companyData);

      // Map the sector to a valid enum value
      if (companyData.sector) {
        const mappedSector = sectorMapping[companyData.sector] || companyData.sector;
        console.log(`Mapping sector from "${companyData.sector}" to "${mappedSector}"`);
        companyData.sector = mappedSector;
      }

    } catch (e) {
      console.error('Failed to parse GPT response:', data.choices[0].message.content);
      console.error('Parse error:', e);
      throw new Error('Failed to parse company data: ' + e.message);
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

    // Get or create canonical sector
    const { data: canonicalSectorId, error: sectorError } = await supabase
      .rpc('manage_canonical_sector', {
        input_sector: companyData.sector
      });

    if (sectorError) {
      throw new Error(`Error managing canonical sector: ${sectorError.message}`);
    }

    // Add canonical sector ID to company data
    companyData.canonicalSectorId = canonicalSectorId;

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
