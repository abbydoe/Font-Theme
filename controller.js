figma.showUI(__html__, { width: 800, height: 600 });
const url = "https://plugin.synergyapp.us/api/font-pairings";
figma.ui.onmessage = async (pluginmessage) => {
  console.log(pluginmessage);
  if (pluginmessage.type == "find-font") {
    fetchFontPairings(pluginmessage);
  } 
  if (pluginmessage.type == "create-text-style") {
    const { fonts } = pluginmessage;

    for (const font of fonts) {
      const { fontFamily, fontWeights } = font;

      console.log(`Processing font: ${fontFamily}`);

      for (let weight of fontWeights) {
        console.log(`Creating style for ${fontFamily} with weight ${weight}`);
        await createTextStyle(fontFamily, weight, `${fontFamily} ${weight}`);
      }
    }

    figma.notify(`Text styles created for all fonts!`);
  }
};

async function fetchFontPairings(pluginmessage) {
  try {
    // 🔄 Notify UI to show loading spinner
    figma.ui.postMessage({ type: "show-spinner" });

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
  } catch (error) {
    console.error("Error fetching font pairings:", error);
    figma.notify("Failed to fetch font pairings. Please try again.");
    // ❌ Hide spinner even if there's an error
    figma.ui.postMessage({ type: "hide-spinner" });
  }
}

async function listAvailableStyles(fontFamily) {
  const allFonts = await figma.listAvailableFontsAsync();
  const availableStyles = allFonts
    .filter((font) => font.fontName.family === fontFamily)
    .map((font) => font.fontName.style);

  console.log(`Available styles for ${fontFamily}:`, availableStyles);
  return availableStyles;
}

function mapWeightToStyle(fontFamily, fontWeight, availableStyles) {
  const weightToStyleMap = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
    900: "Black",
  };

  const preferredStyle = weightToStyleMap[fontWeight];
  console.log(`Mapping weight ${fontWeight} to style: ${preferredStyle}`);

  if (availableStyles.includes(preferredStyle)) {
    return preferredStyle;
  }

  console.warn(
    `Style ${preferredStyle} not found for ${fontFamily}. Falling back to ${
      availableStyles[0] || "Regular"
    }.`
  );
  return availableStyles[0] || "Regular";
}

async function createTextStyle(fontFamily, fontWeight, styleName) {
  const availableStyles = await listAvailableStyles(fontFamily);
  const style = mapWeightToStyle(fontFamily, fontWeight, availableStyles);

  const regularFontName = { family: fontFamily, style: "Regular" };
  const fontName = { family: fontFamily, style: style };

  try {
    console.log(`Loading "Regular" style for ${fontFamily} first...`);
    await figma.loadFontAsync(regularFontName);

    console.log(`Loading ${style} style for ${fontFamily}...`);
    await figma.loadFontAsync(fontName);

    const textStyle = figma.createTextStyle();
    textStyle.name = styleName;
    textStyle.fontSize = 16;
    textStyle.fontName = fontName;

    console.log(`Text style "${styleName}" created successfully with ${style}`);
  } catch (error) {
    console.error(
      `Failed to create text style for ${fontFamily} ${style}`,
      error
    );
  }
}
