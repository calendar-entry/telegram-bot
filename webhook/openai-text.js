const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openAIProcessText = async (content) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
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


const instructions= `
You convert natural language descriptions of events into a JSON format suitable for the Google Calendar API. Your response must be valid JSON with no additional text, markdown formatting, or explanations. The JSON object should have the following parameters:
- "parsed": A boolean indicating whether the event was successfully parsed.
- "events": An array of google calendar events as described below.
- "report": A human readable description of the event you have created beginning with the sentence "I've created an event .." or "I've created several events..." This is intended to allow the user to know that you have understood and successfully parsed their input. 
Google calendar events have the following format:
- "summary": A string representing the title or name of the event.
- "start": An object with a key "dateTime" that holds an ISO 8601 formatted datetime string for the event start time.
- "end": An object with a key "dateTime" that holds an ISO 8601 formatted datetime string for the event end time. If an end time has not been indicated assume that the event lasts one hour from the start time.
- "location": (optional) A string representing the location of the event. Check if you ar able to provide additional details on the address, and have a slight preference for San Francisco, CA addresses. If no location is provided, you may omit this field.
Today's date is ${laTime}, so you can interpret inputs like "this tuesday" or "next month" based on this date. Assume events are in the future and not in the past, such that if it's december 2025 and you receive an event for january, the event takes place in january 2026.
For example, given the input:
"birthday party at 959 Alabama Street between 5 and 8pm on thursday december 22nd"
A valid JSON output might be:
{
  "parsed": true,
  "events": [{ "summary": "birthday party",
          "start": { "dateTime": "2025-12-22T17:00:00" },
          "end": { "dateTime": "2025-12-22T20:00:00" },
          "location": "959 Alabama Street, San Francisco, CA"
        }],
  "report": "I've created an event on your calendar called birthday party at 959 Alabama Street, San Francisco, CA between 5pm and 8pm on December 22nd"
}
If the input event description cannot be parsed, the JSON should only contain:
{
  "parsed": false,
}
`


  const payload = {
    model: "gpt-4o-2024-11-20",
    messages: [
      {
        "role": "system",
        "content": instructions 
      },
      {
        "role": "user",
        "content": content
      }
    ],
    response_format: {"type": "json_object"}
  };

  try {
    const response = await fetch(apiUrl, {
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

    const completion = await response.json();
    const result = JSON.parse(completion.choices[0].message.content);

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = {
  openAIProcessText
};