figma.showUI(__html__, { width: 800, height: 600 });
const url = "https://plugin.synergyapp.us/api/font-pairings";
figma.ui.onmessage = async (pluginmessage) => {
  console.log(pluginmessage);
  if (pluginmessage.type == "find-font") {
    console.log(pluginmessage);

    async function fetchFontPairings(pluginmessage) {
      try {
        figma.notify("Fetching font pairings..."); // 🔄 Notify user

        const response = await fetch(
          "https://plugin.synergyapp.us/api/font-pairings",
          {
            method: "POST",
            headers: {
              "x-vercel-protection-bypass": "uGJZRkvqbtdpWnAwArA5j2V861oXZn00",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vibe: pluginmessage.vibe,
              fontPairing: pluginmessage.fontPairing,
            }),
          }
        );

        console.log("Raw Response:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response from API:", data);

        figma.ui.postMessage({
          type: "font-pairings-response",
          data: data.fontPairs,
        });
        figma.notify("Font pairings loaded ✅"); // ✅ Notify user of success
      } catch (error) {
        console.error("Error fetching font pairings:", error);
        figma.notify("Failed to fetch font pairings. Please try again.");
      }
    }

    fetchFontPairings(pluginmessage);
  }
};
