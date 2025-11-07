import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateTravelPlan = async (location, totalDays, budget, traveler) => {
    try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);

        // ✅ latest stable Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const userPrompt = `Generate a travel plan for Location: ${location}, for ${totalDays} Days for ${traveler} with a ${budget} budget. The response MUST be in JSON format, structured as follows:

    {
      "location": "string",
      "totalDays": "number",
      "travelers": "string",
      "budget": "string",
      "notes": "string",
      "estimatedCosts": { 
          "currencySymbol": "string (e.g., '₹', '$', '€')",
          "totalEstimatedRange": "string",
          "hotels": { "min": "number", "max": "number", "perNightRange": "string" },
          "activities": { "min": "number", "max": "number", "details": "string" },
          "food": { "min": "number", "max": "number", "details": "string" },
          "localTransport": { "min": "number", "max": "number", "details": "string" },
          "miscellaneous": { "min": "number", "max": "number", "details": "string" }
      },
      "hotels": [{ "name": "string", "address": "string", "price": "string", "imageUrl": "string", "geoCoordinates": {"latitude": "number", "longitude": "number"}, "rating": "number", "description": "string" }],
      "itinerary": [{ "day": "number", "activities": [{ "name": "string", "details": "string", "imageUrls": ["string"], "geoCoordinates": {"latitude": "number", "longitude": "number"}, "rating": "number", "travelTime": "string", "ticketPrice": "string", "optimalVisitTime": "string", "timeSlot": "string", "notes": "string (optional)" }] }],
      "famousLocalFoodGuide": [{ "dishName": "string", "description": "string", "whereToFind": "string" }],
      "alternativeWeatherPlan": { "description": "string", "currentWeatherPlaceholder": "string", "alternatives": { "Rainy": ["string"], "Foggy": ["string"], "Clear": ["string"] }, "noteOnViews": "string" }
    }
    Do not include any text or markdown outside the JSON block.`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        if (!text) throw new Error("Empty AI response");

        //  Clean ```json wrapper if exists - 
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        const cleanedJsonString = jsonMatch ? jsonMatch[1] : text;

        let travelPlan;
        try {
            travelPlan = JSON.parse(cleanedJsonString);
        } catch (err) {
            console.error("❌ Failed to parse JSON:", cleanedJsonString);
            throw new Error("Error parsing AI response: Invalid JSON format.");
        }

        //  formattedPlan 
        const formattedPlan = {
            location: travelPlan.location ?? location,
            totalDays: travelPlan.totalDays ?? totalDays,
            travelers: travelPlan.travelers ?? traveler,
            budget: travelPlan.budget ?? budget,
            notes: travelPlan.notes ?? "No general notes provided.",

            estimatedCosts: {
                currencySymbol: travelPlan.estimatedCosts?.currencySymbol ?? "",
                totalEstimatedRange: travelPlan.estimatedCosts?.totalEstimatedRange ?? "N/A",
                hotels: {
                    min: travelPlan.estimatedCosts?.hotels?.min ?? 0,
                    max: travelPlan.estimatedCosts?.hotels?.max ?? 0,
                    perNightRange: travelPlan.estimatedCosts?.hotels?.perNightRange ?? "N/A",
                },
                activities: {
                    min: travelPlan.estimatedCosts?.activities?.min ?? 0,
                    max: travelPlan.estimatedCosts?.activities?.max ?? 0,
                    details: travelPlan.estimatedCosts?.activities?.details ?? "N/A",
                },
                food: {
                    min: travelPlan.estimatedCosts?.food?.min ?? 0,
                    max: travelPlan.estimatedCosts?.food?.max ?? 0,
                    details: travelPlan.estimatedCosts?.food?.details ?? "N/A",
                },
                localTransport: {
                    min: travelPlan.estimatedCosts?.localTransport?.min ?? 0,
                    max: travelPlan.estimatedCosts?.localTransport?.max ?? 0,
                    details: travelPlan.estimatedCosts?.localTransport?.details ?? "N/A",
                },
                miscellaneous: {
                    min: travelPlan.estimatedCosts?.miscellaneous?.min ?? 0,
                    max: travelPlan.estimatedCosts?.miscellaneous?.max ?? 0,
                    details: travelPlan.estimatedCosts?.miscellaneous?.details ?? "N/A",
                },
            },

            hotels: travelPlan.hotels?.map(hotel => ({
                name: hotel.name ?? "Unknown Hotel",
                address: hotel.address ?? "N/A",
                price: hotel.price ?? "N/A",
                imageUrl: hotel.imageUrl ?? "https://example.com/images/default_hotel.jpg",
                geoCoordinates: hotel.geoCoordinates ?? { latitude: 0, longitude: 0 },
                rating: hotel.rating ?? null,
                description: hotel.description ?? "No description available",
            })) ?? [],

            itinerary: travelPlan.itinerary?.map(day => ({
                day: day.day ?? 0,
                activities: day.activities?.map(activity => ({
                    name: activity.name ?? "Unknown Activity",
                    details: activity.details ?? "No details available",
                    imageUrls: activity.imageUrls ?? ["https://example.com/images/default_activity.jpg"],
                    geoCoordinates: activity.geoCoordinates ?? { latitude: 0, longitude: 0 },
                    rating: activity.rating ?? null,
                    travelTime: activity.travelTime ?? "N/A",
                    ticketPrice: activity.ticketPrice ?? "N/A",
                    optimalVisitTime: activity.optimalVisitTime ?? "Anytime",
                    timeSlot: activity.timeSlot ?? null,
                    notes: activity.notes ?? null,
                })) ?? [],
            })) ?? [],

            famousLocalFoodGuide: travelPlan.famousLocalFoodGuide?.map(food => ({
                dishName: food.dishName ?? (typeof food === "string" ? food : "Unknown"),
                description: food.description ?? (typeof food === "string" ? food : "No description available"),
                whereToFind: food.whereToFind ?? "Local eateries",
            })) ?? [],

            alternativeWeatherPlan: {
                description: travelPlan.alternativeWeatherPlan?.description ?? "Weather can be unpredictable. Here are alternative plans.",
                currentWeatherPlaceholder: travelPlan.alternativeWeatherPlan?.currentWeatherPlaceholder ?? "[[INSERT_REALTIME_WEATHER_HERE]]",
                alternatives: {
                    Rainy: travelPlan.alternativeWeatherPlan?.alternatives?.Rainy ?? ["Seek indoor attractions.", "Visit museums or cafes."],
                    Foggy: travelPlan.alternativeWeatherPlan?.alternatives?.Foggy ?? ["Avoid viewpoints with low visibility.", "Focus on cultural sites."],
                    Clear: travelPlan.alternativeWeatherPlan?.alternatives?.Clear ?? ["Enjoy all planned outdoor activities and viewpoints."],
                    ...travelPlan.alternativeWeatherPlan?.alternatives,
                },
                noteOnViews: travelPlan.alternativeWeatherPlan?.noteOnViews ?? "Views of mountains and landscapes are highly weather-dependent.",
            },
        };

        console.log(" Final Formatted Travel Plan:", JSON.stringify(formattedPlan, null, 2));
        return formattedPlan;

    } catch (error) {
        console.error(" Error generating travel plan:", error);
        return null;
    }
};
