let cachedFonts = null;

const weightOrder = [
  "Thin",
  "ExtraLight",
  "Light",
  "Regular",
  "Medium",
  "SemiBold",
  "Bold",
  "ExtraBold",
  "Black",
];

async function getAllFonts() {
  // Return the cached fonts if they have been loaded already.
  if (cachedFonts) {
    return cachedFonts;
  }

  try {
    // Retrieve all available fonts from Figma
    cachedFonts = await figma.listAvailableFontsAsync();
    return cachedFonts;
  } catch (error) {
    console.error("Error retrieving fonts:", error);
    return [];
  }
}

figma.showUI(__html__, { width: 800, height: 600 });
const url = "https://plugin.synergyapp.us/api/font-pairings";
figma.ui.onmessage = async (pluginmessage) => {
  console.log(pluginmessage);
  
  if (pluginmessage.type == "find-font") {
    fetchFontPairings(pluginmessage);
  }
  
  if (pluginmessage.type == "create-text-style") {
    const { fonts } = pluginmessage;
    console.log("Creating text styles for fonts:", fonts);
    for (const font of fonts) {
      const { fontFamily, fontWeights } = font;
      for (let weight of fontWeights) {
        await createTextStyle(fontFamily, weight);
      }
    }

    figma.notify(`Text styles created for all fonts!`);
  }
};

async function fetchFontPairings(pluginmessage) {
  try {
    // 🔄 Notify UI to show loading spinner
    figma.ui.postMessage({ type: "show-spinner" });

    const allFonts = await getAllFonts();

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

    data.fontPairs.forEach((pair) => {
      ["header", "body"].forEach((part) => {
        const fontFamily = pair[part].font;
        // Filter allFonts for matching family (case-insensitive)
        const matchingFonts = allFonts.filter(
          ({ fontName }) =>
            fontName.family.toLowerCase() === fontFamily.toLowerCase()
        );

        // Create a set to avoid duplicates
        const availableWeights = new Set();
        matchingFonts.forEach(({ fontName }) => {
          // Remove "Italic" if present; we're only concerned with the base weight
          let baseStyle = fontName.style.replace(/ Italic$/, "");
          // Check if this style is one we expect (present in weightOrder)
          if (weightOrder.includes(baseStyle)) {
            availableWeights.add(baseStyle);
          }
        });

        // Convert the set to an array and sort it according to our weightOrder
        const sortedWeights = Array.from(availableWeights).sort((a, b) => {
          return weightOrder.indexOf(a) - weightOrder.indexOf(b);
        });

        // Update the font pair with the newly generated weights
        pair[part].weights = sortedWeights;
      });
    });

    console.log("modified data from API:", data);

    figma.ui.postMessage({
      type: "font-pairings-response",
      data: data.fontPairs,
    });
  } catch (error) {
    console.error("Error fetching font pairings:", error);
    figma.notify("Failed to fetch font pairings. Please try again.");
    // ❌ Hide spinner even if there's an error
    figma.ui.postMessage({ type: "hide-spinner" });
  }
}

async function createTextStyle(fontFamily, fontWeight) {
  const regularFontName = { family: fontFamily, style: "Regular" };
  const fontName = { family: fontFamily, style: fontWeight };

  try {
    await figma.loadFontAsync(regularFontName);
    await figma.loadFontAsync(fontName);

    const textStyle = figma.createTextStyle();
    textStyle.name = fontFamily + " " + fontWeight;
    textStyle.fontName = fontName;

  } catch (error) {
    console.error(
      `Failed to create text style for ${fontFamily} ${fontWeight}`,
      error
    );
  }
}
