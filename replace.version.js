const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const version = process.argv[2];
const directory = process.argv[3];

const replaceInFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /https:\/\/cdn\.jsdelivr\.net\/gh\/JamsRepos\/Jamfin@[0-9.]*/g;
    const matches = content.match(regex);

    if (matches) {
        const updatedContent = content.replace(regex, `https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@${version}`);
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated file: ${filePath} with new version: ${version}`);

        // Stage the updated file for commit
        execSync(`git add ${filePath}`);
    }
};

const processDirectory = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('README.md') || fullPath.endsWith('complete.css')) {
            replaceInFile(fullPath);
        }
    });
};

processDirectory(directory);
