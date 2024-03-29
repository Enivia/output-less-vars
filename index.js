const chalk = require("chalk");
const less = require("less");
const fs = require("fs");
const path = require("path");

const selector = "OUTPUT_LESS_VARIABLES_SELECTOR";

/**
 * @param {string} name
 * @returns {string}
 */
function toUpperCamelCase(name) {
  return name
    .substring(1)
    .split("-")
    .map((str, i) => `${i === 0 ? str[0] : str[0].toUpperCase()}${str.substring(1)}`)
    .join("");
}

/**
 * @param {string} css
 */
function cssToJson(css) {
  const selectorIndex = css.indexOf(selector);
  if (selectorIndex == -1) {
    return "{}";
  }
  const selectorStart = selectorIndex + selector.length + 1;
  const selectorEnd = css.lastIndexOf("}");
  const selectorContents = css.slice(selectorStart, selectorEnd).trim();
  const json = selectorContents.split(";").reduce((res, variable) => {
    if (variable) {
      const [name, value] = variable.split(":");
      res[name.trim()] = value.trim();
    }
    return res;
  }, {});
  return JSON.stringify(json, null, 2);
}

/**
 * @param {string} content
 * @param {string} jsonPath
 */
function writeJson(json, jsonPath) {
  const jsonFile = path.resolve(process.cwd(), jsonPath);
  fs.writeFileSync(jsonFile, json);
  console.log(chalk.blue("Write less vars to json file success:"), jsonFile);
}

function throwError(message, ...args) {
  console.log(chalk.red(message), ...args);
  process.exit(1);
}

/**
 *
 * @param {{less: string, json: string}} options
 * @param {(json: string) => void} callback
 */
module.exports = function outputLessVars(options, callback) {
  const { less: lessPath, json: jsonPath } = options || {};
  const filename = path.resolve(process.cwd(), lessPath);
  const content = fs.readFileSync(filename).toString();

  less.parse(content, { filename }, (err, root) => {
    if (err) {
      throwError("Parse less content error:", err);
    }

    const variables = root.variables();
    const rules = Object.keys(variables).map((name) => `${toUpperCamelCase(name)}: ${name};`);
    const rule = `${selector}{${rules.join("\n")}}`;
    const renderContent = `${content}\n${rule}`;

    less.render(renderContent, { filename, compress: true }, (err, root) => {
      if (err) {
        throwError("Transform vars to json error:", err);
      }

      const json = cssToJson(root.css);
      if (jsonPath) {
        writeJson(json, jsonPath);
      }
      if (callback) {
        callback(json);
      }
    });
  });
};
