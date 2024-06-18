from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import os
import requests
from bs4 import BeautifulSoup

# Setup the Sheets API
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SERVICE_ACCOUNT_FILE = './credentials.json'

# Check if the credentials file exists
if not os.path.exists(SERVICE_ACCOUNT_FILE):
    raise FileNotFoundError(f"Service account file {SERVICE_ACCOUNT_FILE} not found.")

creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
service = build('sheets', 'v4', credentials=creds)

# The ID and range of the spreadsheet
SPREADSHEET_ID = '17dztvP9yD1XQhPfhe8uhnQkYc8QVuTKYPwmrH2LdZfc'  # Use the correct spreadsheet ID
RANGE_NAME = 'SCHOLARSHIPS TO INTERNATIONAL STUDENTS!B3:B5'  # Ensure this matches your sheet name and range

print(f"Spreadsheet ID: {SPREADSHEET_ID}")
print(f"Range: {RANGE_NAME}")

# List sheets to ensure we have the correct document
try:
    sheets_metadata = service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
    sheet_names = [sheet['properties']['title'] for sheet in sheets_metadata['sheets']]
    if 'SCHOLARSHIPS TO INTERNATIONAL STUDENTS' not in sheet_names:
        raise ValueError("Sheet name 'SCHOLARSHIPS TO INTERNATIONAL STUDENTS' not found in the spreadsheet.")

    result = service.spreadsheets().values().get(spreadsheetId=SPREADSHEET_ID, range=RANGE_NAME).execute()
    values = result.get('values', [])

    # Get the hyperlinks
    result = service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID, ranges=RANGE_NAME, fields="sheets(data(rowData(values(hyperlink,userEnteredValue))))").execute()
    hyperlinks = result['sheets'][0]['data'][0]['rowData']

    # Combine data with hyperlinks
    combined_data = []
    for i, row in enumerate(values):
        link = ''
        if i < len(hyperlinks):
            link_data = hyperlinks[i].get('values', [])
            if len(link_data) > 0:
                link = link_data[0].get('hyperlink', '')
        combined_data.append((row[0], link))

    # Extract URLs only
    urls = [link for _, link in combined_data]

    scraped_data = []
    for url in urls:
        if url:
            try:
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                h1 = soup.find('h1').text.strip() if soup.find('h1') else 'No H1 Found'
                scraped_data.append({'url': url, 'h1': h1})
            except Exception as e:
                scraped_data.append({'url': url, 'h1': f'Error: {e}'})
        else:
            scraped_data.append({'url': 'No URL', 'h1': 'No H1 Found'})

    # Print the scraped data
    for data in scraped_data:
        print(data)

except ValueError as err:
    print(f"Value error: {err}")

except IndexError as err:
    print(f"Index error: {err}")