const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const log = require("fancy-log");
const rename = require("gulp-rename");
const inlinesource = require("gulp-inline-source");
const replace = require("gulp-replace");

function inlineFontsInCSSFiles(source, context) {
    if (source.type !== "css") {
        log("Ignore non-CSS file:", source.filepath);
        return;
    }

    log("Process CSS file:", source.filepath);
    const fileContent = source.fileContent;
    let modifiedFileContent = fileContent;
    
    // Find all the url() expressions that look like "url(/static/<rest of the path>) format(<something>)".
    const staticResourceUrlPattern = /url\(\/static\/([^)]+)\)\s*format\(([^)]+)\)/g;
    const regexMatches = fileContent.matchAll(staticResourceUrlPattern);

    if (regexMatches) {
        // Nb. of characters added or removed before the current match.
        // It must be updated everytime the file content is modified.
        let cumulativeSizeDifference = 0;

        // Sort the matches and modify them from the earliest one to the latest.
        const matches = [...regexMatches].sort((match1, match2) => match1.index - match2.index);

        for (let match of matches) {
            // log("Match:", match[0], match[1], match[2]);
            const startIndex = match.index + cumulativeSizeDifference;
            const endIndex = match.index + match[0].length + cumulativeSizeDifference;

            const fontUrl = path.join(path.dirname(source.filepath), "/../", match[1].split("#")[0]);
            const fontFormat = match[2].replace(/['"]/g, "");
            log("Url and format:", fontUrl, fontFormat);

            const urlFileContent = fs.readFileSync(fontUrl);
            // log("Finished reading");

            const oldMatchValue = match[0];
            const newMatchValue = `url(data:font/${fontFormat};charset=utf-8;base64,${urlFileContent.toString("base64")})format("${fontFormat}")`;
            const sizeDifference = newMatchValue.length - oldMatchValue.length;

            modifiedFileContent =
                `${modifiedFileContent.substring(0, startIndex)}${newMatchValue}${modifiedFileContent.substring(endIndex)}`;
            // log(modifiedFileContent.substring(startIndex - 20, endIndex + 20))
            // log("\n")
            cumulativeSizeDifference = cumulativeSizeDifference + sizeDifference;
        }
    }

    source.content = modifiedFileContent;
    log("The content of the CSS file has been modified");
}

// Gulp task for bundling the production output produced by CRA into a single HTML file.
// It is based on https://www.labnol.org/code/bundle-react-app-single-file-200514.
gulp.task("default", () => {
  return gulp
    .src("./build/index.html")
    .pipe(replace('.js"></script>', '.js" inline></script>'))
    .pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
    .pipe(inlinesource({
        handlers: [inlineFontsInCSSFiles]
    }))
    .pipe(rename("monocle-editor.html"))
    .pipe(gulp.dest("./build"));
});
