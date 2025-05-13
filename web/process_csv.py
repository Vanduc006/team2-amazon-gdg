import pandas as pd
import json

def process_csv_to_json(input_file):
    try:
        # Read CSV file
        df = pd.read_csv(input_file)
        
        # Convert DataFrame to dictionary
        data_dict = df.to_dict('records')[0]  # Get first row as dictionary
        
        # Convert to JSON with nice formatting
        json_output = json.dumps(data_dict, indent=2)
        
        # Write to output file
        with open('product.json', 'w') as file:
            file.write(json_output)
            
        print("JSON conversion completed. Output saved to product.json")
        return json_output
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")

if __name__ == "__main__":
    process_csv_to_json('product.csv') 