import pandas as pd 
import string
import re
import numpy as np
import nltk
# from nltk.stem import WordNetLemmatizer
# from nltk.corpus import stopwords 
from nltk.tokenize import TweetTokenizer
import emot
emot_obj = emot.emot()
import spacy





def encode_rating(rating: float) -> int:
    try:
        rating = float(rating)
    except:
        return -1
    if rating <= 0:
        return -1
    elif rating <= 2:
        return 0
    elif rating < 4:
        return 1
    elif rating > 5:
        return -1
    else:
        return 2
    

def text_normalize(text):
    #lowercasing
    text = text.lower()
    
    # hyperlinks removal
    text = re.sub(r'https?:\/\/.*[\r\n]*', '', text)
    
    # remove punctuation
    text = re.sub(r'[^\w\s]', ' ', text)
    
    #Remove stopwords
    stopwords_txt = pd.read_csv('../data/stop_words_english.csv', header=None)
    stop_words = stopwords_txt[0].tolist()
    words = text.split()
    words = [word for word in words if word not in stop_words]
    text = ' '.join(words)                                          # Space handling
    return text

# remove emoticons to using emot
def handle_emoticons(text, remove_emoticon=True):
    dict_emoticons = dict(zip(emot_obj.emoticons(text)['value'], emot_obj.emoticons(text)['mean']))
    res_emoticons =  dict(sorted(dict_emoticons.items(), key = lambda kv:len(kv[1]), reverse=True))
    for emoticon, mean in res_emoticons.items():
        if remove_emoticon:
            text = text.replace(emoticon, "")
        else:
            text = text.replace(emoticon, mean)
    return text

def handle_emojis(text, remove_emoji=True):
    for emoji, mean in zip(emot_obj.emoji(text)['value'], emot_obj.emoji(text)['mean']):
        if remove_emoji:
            text = text.replace(emoji, "")
        else:
            text = text.replace(emoji, mean)
    return text

def keep_ascii_alnum(text):
    # 1) Strip out any char that's not a letter, digit, or whitespace
    cleaned = re.sub(r'[^A-Za-z0-9\s]+', '', text)
    
    # 2) Collapse runs of whitespace into a single space, and trim ends
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return str(cleaned)

def lemmatize_text(text):
    doc = nlp(text)
    return " ".join([token.lemma_ for token in doc])