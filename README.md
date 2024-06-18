## To run website locally

MAY NEED TO RUN npm install when needed
1. cd backend
2. node index.js 
- server is run on 5001
3. open new terminal
4. cd frontent 
5. npm start
- server is run on 300

## To run script that adds entries
1. cd scripts
2. source venv/bin/activate 
- activate virtual environment
3. pip install psycopg2 
- may not be needed
4. python add_to_db.py
- reset local environment, should see the updated version

may be needed after initialising virtual environment:
pip install google-api-python-client google-auth google-auth-oauthlib google-auth-httplib2
pip install requests beautifulsoup4
