import modal
from api import stub as api_stub

# Create main app
app = modal.App("distilbert-sentiment-api")

# Include API app
app.include(api_stub) 