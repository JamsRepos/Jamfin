const axios = require('axios');
const fs = require('fs');
const path = require('path');

function getCssFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getCssFiles(filePath, fileList);
        } else if (file.endsWith('.css')) {
            const relativePath = path.relative(__dirname, filePath);
            fileList.push(`/gh/JamsRepos/Jamfin@latest/${relativePath}`);
        }
    });
    return fileList;
}

async function purgeCdnCache() {
    try {
        const cssDirectory = path.resolve(__dirname, './theme');
        const paths = getCssFiles(cssDirectory);

        const jsonPayload = {
            path: paths,
        };

        const response = await axios.post('https://purge.jsdelivr.net/', jsonPayload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const id = response.data.id;
        let status = 'pending';

        while (status === 'pending') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const statusResponse = await axios.get(`https://purge.jsdelivr.net/status/${id}`);
            status = statusResponse.data.status;
        }

        if (status === 'finished') {
            console.log('CDN cache purge finished successfully.');
        } else {
            console.error('CDN cache purge failed.');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error during CDN cache purge:', error);
        process.exit(1);
    }
}

purgeCdnCache();
