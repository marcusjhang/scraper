import psycopg2

# Define the example entry
example_entry = {
    "name": "New Student Scholarship",
    "description": "A scholarship for international students.",
    "eligibility": "Open to all international students.",
    "country": "Singapore",
    "field_of_study": "Computer Science",
    "degree_level": "Masters",
    "application_deadline": "2023-12-30",
    "link": "http://example.com/scholarship"
}

try:
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(
        dbname="scholarships_db",
        user="postgres",
        password="password",  # postgres password
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()

    # Insert the example entry into the scholarships table
    insert_query = """
    INSERT INTO scholarships (name, description, eligibility, country, field_of_study, degree_level, application_deadline, link)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING scholarship_id;
    """
    cursor.execute(insert_query, (
        example_entry['name'],
        example_entry['description'],
        example_entry['eligibility'],
        example_entry['country'],
        example_entry['field_of_study'],
        example_entry['degree_level'],
        example_entry['application_deadline'],
        example_entry['link']
    ))

    # Commit the transaction
    conn.commit()
    print("Transaction committed.")

    # Fetch the generated scholarship_id
    scholarship_id = cursor.fetchone()[0]
    print(f"Inserted example entry with scholarship_id: {scholarship_id}")

except Exception as error:
    print(f"Error: {error}")
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()

# Verify insertion
try:
    conn = psycopg2.connect(
        dbname="scholarships_db",
        user="postgres",
        password="password",  # postgres password
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scholarships;")
    rows = cursor.fetchall()
    print("Data in scholarships table:")
    for row in rows:
        print(row)
except Exception as error:
    print(f"Error during verification: {error}")
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()