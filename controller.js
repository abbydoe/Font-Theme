figma.showUI(__html__, { width: 800, height: 600 });
const url = "https://plugin.synergyapp.us/api/font-pairings";
figma.ui.onmessage = (pluginmessage) => {
  console.log(pluginmessage);
  if (pluginmessage.type == "find-font") {
    console.log(pluginmessage);

    fetch("https://plugin.synergyapp.us/api/font-pairings", {
      method: "POST",
      headers: {
        "x-vercel-protection-bypass": "uGJZRkvqbtdpWnAwArA5j2V861oXZn00",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vibe: pluginmessage.vibe,
        fontPairing: pluginmessage.fontPairing,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response from API:", data);
        // Handle the API response (e.g., display the font pairing in UI)
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "There was an issue fetching the font pairings. Please try again."
        );
      });
  }
};

// figma.ui.onmessage = async (msg) => {
//   console.log(msg);
// };

// figma.ui.onmessage = async (msg) => {
//   console.log(msg);
//   if (msg.type === "use-font") {
//     const { fontFamily } = msg;
//     const selectedNodes = figma.currentPage.selection;

//     const headers = {
//       "Content-Type": "application/json",
//       "x-vercel-protection-bypass": "uGJZRkvqbtdp0", // Include if required
//     };

//     const body = {
//       vibe: vibe,
//       fontPairing: fontPairing,
//     };
//     async function sendMessage() {
//       try {
//         const response = await fetch(url, {
//           method: "POST", // POST method to send the message
//           headers: headers,
//           body: JSON.stringify(body), // Convert body object to JSON string
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json(); // Parse JSON response
//         console.log("Response:", data);
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     }

//     sendMessage();

//     if (selectedNodes.length === 0) {
//       figma.notify("No nodes selected.");
//       return;
//     }

//     for (const node of selectedNodes) {
//       if (node.type === "TEXT") {
//         try {
//           await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
//           node.fontName = { family: fontFamily, style: "Regular" };
//           figma.notify(`Font "${fontFamily}" applied successfully!`);
//         } catch (error) {
//           figma.notify(`Failed to apply font: ${error.message}`);
//         }
//       }
//     }
//   } else if (msg.type === "save-font") {
//     figma.notify("Font saved for later!");
//   }

//   if (msg.type === "use-font") {
//     const { fontFamily } = msg;
//     const selectedNodes = figma.currentPage.selection;

//     if (selectedNodes.length === 0) {
//       figma.notify("No nodes selected.");
//       return;
//     }

//     for (const node of selectedNodes) {
//       if (node.type === "TEXT") {
//         try {
//           await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
//           node.fontName = { family: fontFamily, style: "Regular" };
//           figma.notify(`Font "${fontFamily}" applied successfully!`);
//         } catch (error) {
//           figma.notify(`Failed to apply font: ${error.message}`);
//         }
//       }
//     }
//   } else if (msg.type === "save-font") {
//     figma.notify("Font saved for later!");
//   } else if (msg.type === "find-font") {
//     console.log(msg);

//     // const { vibe } = msg; // The vibe or input sent from the UI

//     // // Define the API endpoint
//     // const url = "https://plugin.synergyapp.us/api/font-pairings";

//     // // Request payload
//     // const payload = {
//     //   vibe: "modern and clean",
//     //   fontPairing: 2,
//     // };

//     // // Request headers
//     // const headers = {
//     //   "x-vercel-protection-bypass": "uGJZRkvqbtdpWnAwArA5j2V861oXZn00",
//     //   "Content-Type": "application/json",
//     // };

//     // // Perform the POST request
//     // fetch(url, {
//     //   method: "POST", // HTTP method
//     //   headers: headers, // Include headers
//     //   body: JSON.stringify(payload), // Convert payload to JSON string
//     // })
//     //   .then((response) => {
//     //     if (!response.ok) {
//     //       throw new Error(`HTTP error! status: ${response.status}`);
//     //     }
//     //     return response.json(); // Parse the JSON response
//     //   })
//     //   .then((data) => {
//     //     console.log("Response from API:", data); // Handle the API response
//     //   })
//     //   .catch((error) => {
//     //     console.error("Error:", error); // Handle errors
//     //   });

//     // try {
//     //   // Make an API call to your backend or endpoint
//     //   const response = await fetch(url, {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       "x-vercel-protection-bypass": "uGJZRkvqbtdpWnAwArA5j2V861oXZn00",
//     //     },
//     //     body: JSON.stringify({
//     //       vibe, // Pass the vibe variable
//     //       fontPairing: 2, // Include fontPairing in the body
//     //     }),
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error(`API returned status ${response.status}`);
//     //   }

//     //   const data = await response.json(); // Expected to return { fontFamily: "Some Font" }

//     //   // Send the font data back to the UI
//     //   figma.ui.postMessage({
//     //     type: "font-found",
//     //     fontFamily: data.fontFamily,
//     //   });
//     // } catch (error) {
//     //   figma.notify(`Failed to find font: ${error.message}`);
//     // }
//   }
//   function loadGoogleFont(fontName) {
//     const link = document.createElement("link");
//     link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
//       / /g,
//       "+"
//     )}&display=swap`;
//     link.rel = "stylesheet";
//     document.head.appendChild(link);
//   }
// };
