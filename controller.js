figma.showUI(__html__, { width: 800, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "use-font") {
    const { fontFamily } = msg;
    const selectedNodes = figma.currentPage.selection;

    if (selectedNodes.length === 0) {
      figma.notify("No nodes selected.");
      return;
    }

    for (const node of selectedNodes) {
      if (node.type === "TEXT") {
        try {
          await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
          node.fontName = { family: fontFamily, style: "Regular" };
          figma.notify(`Font "${fontFamily}" applied successfully!`);
        } catch (error) {
          figma.notify(`Failed to apply font: ${error.message}`);
        }
      }
    }
  } else if (msg.type === "save-font") {
    figma.notify("Font saved for later!");
  }
};
