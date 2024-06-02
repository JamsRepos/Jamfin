const fs = require('fs');
const path = require('path');

const version = process.argv[2];
const directory = process.argv[3];

const replaceInFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/JamsRepos\/Jamfin@[0-9.]*/g, `https://cdn.jsdelivr.net/gh/JamsRepos/Jamfin@${version}`);
    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated file: ${filePath}`);
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
