import json

def process_product_data(input_file):
    # Read the input file
    with open(input_file, 'r') as file:
        lines = file.readlines()
    
    # Get headers from first line
    headers = lines[0].strip().split(',')
    
    # Get data from second line
    data = lines[1].strip().split(',')
    
    # Create dictionary by combining headers and data
    product_dict = {}
    for i, header in enumerate(headers):
        # Handle special cases where data might contain commas within quotes
        if i < len(data):
            value = data[i]
            # Remove quotes if present
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            product_dict[header] = value
    
    # Convert to JSON
    json_output = json.dumps(product_dict, indent=2)
    
    # Write to output file
    with open('product.json', 'w') as file:
        file.write(json_output)
    
    return json_output

if __name__ == "__main__":
    result = process_product_data('product.txt')
    print("JSON conversion completed. Output saved to product.json") 