const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openAIProcessImage = async (base64Image) => {
  const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
  const now = new Date();
  const laTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: false
  }).format(now);

  const instructions = `
  You are an assistant that converts images which contain information about an event, maybe an event flier, into a JSON format suitable for the Google Calendar API. Your response must be valid JSON with no additional text, markdown formatting, or explanations. The JSON object should have the following keys:
  - "parsed": A boolean indicating whether the event was successfully parsed.
  - "summary": A string representing the title or name of the event.
  - "start": An object with a key "dateTime" that holds an ISO 8601 formatted datetime string for the event start time.
  - "end": An object with a key "dateTime" that holds an ISO 8601 formatted datetime string for the event end time. If an end time has not been indicated assume that the event lasts one hour from the start time. 
  - Optionally, include the keys "description" or "location" if this information is provided in the description.
  Today's date is ${laTime}, so you can interpret inputs like "this tuesday" or "next month" based on this date. Assume events are in the future and not in the past, unless evidence to the contrary, such that if it's december 2025 and you receive an event for january, the event takes place in january 2026.
  The events take place in the 'America/Los_Angeles' time zone unless instructed otherwise. 
  If the image you receive doesn't seem to contain information about an image, your JSON should only contain:
  {
  "parsed": false,
  "error": "Could not parse event description."
  }
  `;

  const payload = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": instructions 
      },
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    "max_tokens": 300,
    "response_format": {"type": "json_object"}
  };

  try {
    const response = await fetch(openaiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = {
    openAIProcessImage
};