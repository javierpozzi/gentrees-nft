import pinata from "@pinata/sdk/";
import { task } from "hardhat/config";

task("upload-meta", "Upload metadata to IPFS.").setAction(async () => {
  console.log("Uploading metadata to IPFS...");
  const pinataClient = pinata(
    process.env.PINATA_API_KEY!,
    process.env.PINATA_API_SECRET!
  );
  const result = await pinataClient.pinFromFS(`out/meta`, {
    pinataMetadata: {
      name: "gentrees-metadata",
    },
  });
  console.log("Done! Metadata IPFS CID:", result.IpfsHash);
});
