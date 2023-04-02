# CSV to Database

### A tool for tranferring data from a .csv-file to a database

This directory contains a tool for importing data from CSV files into a database. The tool is intended to be used as part of a larger software project, and it assumes that the target database schema has already been created. The exact database schema can be found in `/tools/sql_create_tables.sql`

To use this tool, Node has to be installed on the computer. This tool was tested on `Node v18.15.0`

### Installation

1. Clone the whole repository to your computer:<br />
`git clone https://github.com/Depajo/ohjelmistotuotannon-projekti`

2. Navigate to the root directory of the tool:<br />
`cd tools/csvToDatabase`

3. Install all modules used in the script:<br /> 
`npm install`

### Usage

1. Make an .env file to the root directory (`tools/csvToDatabase`) with the following data:
```
DB_HOST="<your hostaddress>"
DB_DATABASE="<your database>"
DB_USER="<your username>"
DB_PASSWORD="<your password>"
```

2. Run the script:<br />
`node out/index.js <csv-filename> <region> <munincipality>`

__DISCLAIMER!__<br />
!!!<br />
This script assumes that before running, the .csv file is properly filtered to have specific data structure. The data structure is as follows:
`region_id,munincipality_id,street,street_number,postal_code,latitude,longitude`. **There cannot be multiple region id's and munincipalities as this script only supports
only one region id and munincipality on the command line. _If there are multiple region id's or munincipalities they won't match with your given region and
munincipality._ Only use .csv files that have only one region id and munincipality id (see example in `resources/Tampere_kadut.csv`)**<br />
!!!

Depending on how many lines there are in the .csv file, this script will take time. After every group of data is done inserting data, there is a timestap for how long it
took. Usually the last group (streets) take the longest and in extreme cases may take up to several tens of minutes in executing the code. If it seems that the code 
isn't doing anything, it actually is. The script will end either in a message that says the insert was successful or in a sql error that reverts all inserts.

This script uses transactions when inserting data to the database and will only commit changes to the database when all insert queries are successful. In case of 
an sql error, the insert queries will rollback and no changes will be committed

### Tech/Framework used

This tool makes use of these modules:

[dotenv](https://github.com/motdotla/dotenv): Used to store database configuration that will be used when connection to the database.
[mysql](https://github.com/mysqljs/mysql): Main module for making a connection to and querying the database.

### License

This project is licensed under the terms of the MIT license.
