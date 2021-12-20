import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x5B05a512cCA0F4A40462c5A6D8D1d1dc3402B17C",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "OG 1's",
        description: "This NFT will give you access to SNKRDAO!",
        image: readFileSync("scripts/assets/air-jordan-1-retro-og-hero_xf8joi.jpg"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()