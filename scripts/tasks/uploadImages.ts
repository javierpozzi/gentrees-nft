import pinata from "@pinata/sdk/";
import { task } from "hardhat/config";

task("upload-images", "Upload images to IPFS.").setAction(async () => {
  console.log("Uploading images to IPFS...");
  const pinataClient = pinata(
    process.env.PINATA_API_KEY!,
    process.env.PINATA_API_SECRET!
  );
  const result = await pinataClient.pinFromFS(`out/img`, {
    pinataMetadata: {
      name: "gentrees-images",
    },
  });
  console.log("Done! Images IPFS CID:", result.IpfsHash);
});
