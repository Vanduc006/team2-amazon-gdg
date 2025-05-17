import pandas as pd
import json



def csv2json(input_file, output_file):
    try:
        read = pd.read_csv(input_file)
        data = read.to_dict(orient='records')
        json_data = json.dumps(data, indent=2, ensure_ascii=False)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(json_data)
    except Exception as e:
        print(e)

        
def csv2json_string(input_file):
    df = pd.read_csv(input_file)
    data = df.to_dict(orient='records')
    return json.dumps(data, indent=2, ensure_ascii=False)
