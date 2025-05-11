const fs = require('fs');

function processProductData(inputFile) {
    try {
        // Read the input file
        const content = fs.readFileSync(inputFile, 'utf8');
        const lines = content.split('\n');

        // Get headers from first line
        const headers = lines[0].trim().split(',');

        // Get data from second line
        const data = lines[1].trim().split(',');

        // Create object by combining headers and data
        const productObj = {};
        headers.forEach((header, index) => {
            if (index < data.length) {
                let value = data[index];
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                productObj[header] = value;
            }
        });

        // Convert to JSON
        const jsonOutput = JSON.stringify(productObj, null, 2);

        // Write to output file
        fs.writeFileSync('product.json', jsonOutput);

        console.log('JSON conversion completed. Output saved to product.json');
        return jsonOutput;
    } catch (error) {
        console.error('Error processing file:', error.message);
    }
}

// Run the function
processProductData('product.txt'); 