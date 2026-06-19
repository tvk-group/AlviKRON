const fs = require("fs");
const path = require("path");

const artifactPath = path.join(
  __dirname,
  "../artifacts/build-info",
);

const buildInfoDir = artifactPath;
const files = fs.readdirSync(buildInfoDir).filter((f) => f.endsWith(".json"));
if (!files.length) {
  console.error("Run `npx hardhat compile` first.");
  process.exit(1);
}

const buildInfo = JSON.parse(
  fs.readFileSync(path.join(buildInfoDir, files[0]), "utf8")
);

const input = {
  language: buildInfo.input.language,
  sources: buildInfo.input.sources,
  settings: buildInfo.input.settings,
};

const out = path.join(__dirname, "../basescan-standard-json-input.json");
fs.writeFileSync(out, JSON.stringify(input, null, 2));
console.log("Wrote", out);
