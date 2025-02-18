
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

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

function extractRelevantText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  if (!doc) return '';

  // Remove script and style elements
  doc.querySelectorAll('script, style').forEach(el => el.remove());

  // Get text from important elements
  const titleText = doc.querySelector('title')?.textContent || '';
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1Text = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent).join(' ');
  const h2Text = Array.from(doc.querySelectorAll('h2')).slice(0, 3).map(el => el.textContent).join(' ');
  const mainText = doc.querySelector('main')?.textContent || '';
  
  // Combine and clean the text
  let combinedText = `${titleText} ${metaDescription} ${h1Text} ${h2Text} ${mainText}`
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000); // Limit to 4000 characters

  return combinedText;
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

    // Fetch and extract relevant content from website
    console.log('Fetching website content...');
    const websiteResponse = await fetch(url);
    const htmlContent = await websiteResponse.text();
    const relevantContent = extractRelevantText(htmlContent);
    
    console.log('Extracted content length:', relevantContent.length);
    
    const prompt = `Analyze this company's website content and provide accurate information. Only use the information provided:

${relevantContent}

Return a JSON object strictly following this format:
{
  "name": "Company name from website",
  "sector": One of ["Artificial Intelligence (AI)", "Fintech", "HealthTech", "E-commerce & RetailTech", "Sales Tech & RevOps", "HR Tech & WorkTech", "PropTech (Real Estate Tech)", "LegalTech", "EdTech", "Cybersecurity", "Logistics & Supply Chain Tech", "Developer Tools & Web Infrastructure", "SaaS & Enterprise Software", "Marketing Tech (MarTech)", "InsurTech", "GovTech", "Marketplace Platforms", "Construction Tech & Fintech", "Mobility & Transportation Tech", "CleanTech & ClimateTech"],
  "subSector": "Specific focus area from content",
  "fundingType": "Not Disclosed",
  "fundingDate": "Not Disclosed",
  "fundingAmount": "0",
  "websiteUrl": "${url}",
  "headquarterLocation": "Location from content or Not Available",
  "description": "Main product/service description in 20 words or less",
  "tags": ["3-5 relevant tags"]
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
            content: 'You are a precise research assistant that analyzes company websites. Only use the provided content. Never make assumptions or generate information.' 
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
