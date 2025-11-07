

export const SelectTravelesList = [
    {
        id:1,
        title:'Just Me',
        desc:'A sole traveles in exploration',
        icons:'✈️',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two traveles in tandem',
        icons:'🥂',
        people:'2 People'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icons:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seeks',
        icons:'🎉',
        people:'5 to 10 People'
    },
]

export const SelectBudgetOptions = [
    {
        id:1,
        title:'low-price',
        desc:'Stay conscious of costs',
        icons:'💰',

    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icons:'💳',
        
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icons:'💸',
        
    },
    
]

export const AI_PROMPT = `Generate a travel plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. The response MUST be in JSON format, structured as follows:

    {
            "location": "string",
            "totalDays": "number",
            "travelers": "string",
            "budget": "string",
            "notes": "string",
            "estimatedCosts": { 
                "currencySymbol": "string (e.g., '₹', '$', '€' - based on the location)",
                "totalEstimatedRange": "string (e.g., '₹15,000 - ₹25,000' or '$500 - $800')",
                "hotels": {
                "min": "number",
                "max": "number",
                "perNightRange": "string (e.g., '₹5000 - ₹8000 per night')"
                },
                "activities": {
                "min": "number",
                "max": "number",
                "details": "string (e.g., 'Includes entrance fees, guided tours')"
                },
                "food": {
                "min": "number",
                "max": "number",
                "details": "string (e.g., 'Meals at local eateries and some mid-range restaurants')"
                },
                "localTransport": {
                "min": "number",
                "max": "number",
                "details": "string (e.g., 'Taxis, buses, local trains')"
                },
                "miscellaneous": {
                "min": "number",
                "max": "number",
                "details": "string (e.g., 'Souvenirs, emergencies, small purchases')"
                }
            },
            "hotels": [  
                {
                "name": "string",
                "address": "string",
                "price": "string (e.g., '₹X - ₹Y per night' using the local currency symbol for the location provided)",
                "imageUrl": "string",
                "geoCoordinates": {
                    "latitude": "number",
                    "longitude": "number"
                },
                "rating": "number",
                "description": "string"
                }
            ],
            "itinerary": [
                {
                "day": "number",
                "activities": [
                    {
                    "name": "string",
                    "details": "string",
                    "imageUrls": ["string"],
                    "geoCoordinates": {
                        "latitude": "number",
                        "longitude": "number"
                    },
                    "rating": "number",
                    "travelTime": "string",
                    "ticketPrice": "string",
                    "optimalVisitTime": "string",
                    "notes": "string (optional)", // NO TRAILING COMMA HERE
                    "timeSlot": "string (e.g., '9:00 AM - 11:00 AM' for a 'Morning' visit, '2:00 PM - 3:30 PM' for 'Afternoon' and for night, all are depends on each day with best time to visit)"
                    }
                ]
                }
            ],
            "famousLocalFoodGuide": [
                {
                "dishName": "string",
                "description": "string",
                "whereToFind": "string"
                }
            ],
            "alternativeWeatherPlan": {
                "description": "string",
                "currentWeatherPlaceholder": "string",
                "alternatives": {
                "Rainy": ["string"],
                "Foggy": ["string"],
                "Clear": ["string"]
                },
                "noteOnViews": "string"
                }
            }
            Do not include any text or markdown outside the JSON block.`;