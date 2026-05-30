const fs = require("node:fs");

const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  WIALON_API_URL: process.env.WIALON_API_URL || "",
  WIALON_TOKEN: process.env.WIALON_TOKEN || "",
  WIALON_UNIT_ID: process.env.WIALON_UNIT_ID || ""
};

const output = `window.LABESA_CONFIG = ${JSON.stringify(config, null, 2)};\n`;

fs.writeFileSync("config.js", output);
console.log("Generated config.js from environment variables.");
