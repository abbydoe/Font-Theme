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

    // async function listAllFonts() {
    //   const fonts = await figma.listAvailableFontsAsync();
    //   console.log("Available Fonts:", fonts);
    // }
    // listAllFonts();

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
  // Standard weight mapping based on closest matching names
  const weightToStyleMap = {
    100: ["Thin", "Extra Light"],
    200: ["Extra Light", "Light"],
    300: ["Light", "Regular"],
    400: ["Regular", "Normal", "Medium"],
    500: ["Medium", "SemiBold"],
    600: ["Semi Bold", "Bold"],
    700: ["Bold", "Extra Bold"],
    800: ["Extra Bold", "Black"],
    900: ["Black", "Heavy"],
  };

  console.log(`🔍 Mapping weight ${fontWeight} for font: ${fontFamily}`);
  console.log(`🔹 Available Styles:`, availableStyles);

  // Separate non-italic and italic styles
  const nonItalicStyles = availableStyles.filter(
    (style) => !style.toLowerCase().includes("italic")
  );
  const italicStyles = availableStyles.filter((style) =>
    style.toLowerCase().includes("italic")
  );

  console.log(`✅ Non-Italic Styles:`, nonItalicStyles);
  console.log(`🔸 Italic Styles:`, italicStyles);

  // Find the best match from the weight mapping
  const preferredStyles = weightToStyleMap[fontWeight] || ["Regular"];

  for (const styleName of preferredStyles) {
    if (nonItalicStyles.includes(styleName)) {
      console.log(`🎯 Matched Non-Italic Style: ${styleName}`);
      return styleName;
    }
  }

  // If no perfect match, try a partial match
  for (const styleName of preferredStyles) {
    const match = nonItalicStyles.find((s) =>
      s.toLowerCase().includes(styleName.toLowerCase())
    );
    if (match) {
      console.log(`🎯 Fuzzy Matched Non-Italic Style: ${match}`);
      return match;
    }
  }

  // Fallback: Try italics if no non-italic match is found
  for (const styleName of preferredStyles) {
    if (italicStyles.includes(styleName)) {
      console.log(`🎯 Matched Italic Style: ${styleName}`);
      return styleName;
    }
  }

  // Last Fallback: Return first available style
  console.warn(
    `⚠️ No perfect match found. Using ${availableStyles[0] || "Regular"}.`
  );
  return availableStyles[0] || "Regular";
}

async function createTextStyle(fontFamily, fontWeight, styleName) {
  const availableStyles = await listAvailableStyles(fontFamily);
  const style = mapWeightToStyle(fontFamily, fontWeight, availableStyles);

  console.log(`Loading style for ${style} first...`);

  const regularFontName = { family: fontFamily, style: "Regular" };
  const fontName = { family: fontFamily, style: style };

  try {
    console.log(`Loading "Regular" style for ${fontFamily} first...`);
    await figma.loadFontAsync(regularFontName);

    console.log(`Loading ${style} style for ${fontFamily}...`);
    await figma.loadFontAsync(fontName);

    const textStyle = figma.createTextStyle();
    textStyle.name = styleName;
    //textStyle.fontSize = 16;
    textStyle.fontName = fontName;

    console.log(`Text style "${styleName}" created successfully with ${style}`);
  } catch (error) {
    console.error(
      `Failed to create text style for ${fontFamily} ${style}`,
      error
    );
  }
}
