// figma.showUI(__html__, { width: 300, height: 200 });
// /* CALLING OPENAI API */

// async function getFontRecommendations(vibe) {
//   const openaiApiKey = "YOUR_API_KEY"; // Replace with your actual API key

//   const response = await fetch("https://api.openai.com/v1/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${openaiApiKey}`,
//     },
//     body: JSON.stringify({
//       model: "text-davinci-003",
//       prompt: `Suggest a font pairing that matches this vibe: "${vibe}". Include a body font if one is selected and a primary font and a secondary font if 2 fonts are requested and include a tertiary font if 3 fonts are requested.`,
//       max_tokens: 50,
//     }),
//   });

//   if (!response.ok) {
//     console.error("Error fetching data from OpenAI:", response.statusText);
//     return null;
//   }

//   const data = await response.json();
//   return data.choices[0].text.trim();
// }

// /* SEND USER INPUT TO OPENAI API */

// figma.ui.onmessage = async (msg) => {
//   if (msg.type === "get-fonts") {
//     const vibe = msg.vibe;

//     const recommendation = await getFontRecommendations(vibe);
//     if (recommendation) {
//       figma.ui.postMessage({
//         type: "font-recommendations",
//         recommendation: recommendation,
//       });
//     } else {
//       figma.notify("Failed to get font recommendations. Please try again.");
//     }
//   }
// };

// /* Parse response from OpenAI API and display font recommendations */

// const parseFontRecommendation = (response) => {
//   const lines = response.split("\n");
//   return {
//     primary: lines[0].replace("Primary Font: ", "").trim(),
//     secondary: lines[1].replace("Secondary Font: ", "").trim(),
//   };
// };

// /* Handling errors */

// if (!recommendation) {
//   figma.notify(
//     "OpenAI API returned an error or no response. Please try again."
//   );
// }
