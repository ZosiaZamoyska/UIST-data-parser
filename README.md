# UIST Data Extraction
This parser takes the data from [program site](https://programs.sigchi.org/) in JSON format and parses it to get a list of all papers. 

# Considerations
Data about papers is filtered by trackId of papers, and for each paper following entries are collected:
* author list
* institution list 
* country list 
* url (doi) of paper
* title of paper

Program data in this form is available from UIST 2018, but 2018 and 2019 UIST Program does not contain link to the paper (doi), therefore data extraction cannot be performed. Works best for years from 2020. 