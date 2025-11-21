// fetch is global in Node.js 18+

const API_URL = 'https://api-three-gilt-37.vercel.app/api/get-keyword-volumes';

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Usage: node keyword_research.mjs <keyword1> [keyword2] ...');
        process.exit(1);
    }

    const keywords = args;

    console.log(`Searching for keywords: ${keywords.join(', ')}...`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keywords: keywords,
                options: {
                    languageConstant: "1005", // Japanese
                    geoTargetConstants: ["2392"], // Japan
                    includeAdultKeywords: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error fetching keyword data:', error);
        process.exit(1);
    }
}

main();
