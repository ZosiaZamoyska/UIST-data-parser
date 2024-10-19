const path = require('path');
const fs = require('fs').promises;

const inDir = 'in_json';
const outDir = 'out_json';

const startYear = 20;
const endYear = 24;

function transformData(data, year) {

    // Find the track ID for "UIST 20${year} Papers"
    const trackName = `UIST 20${year} Papers`;
    const track = data.tracks.find(track => track.name === trackName);
    if (!track) {
      return { papers: [] };
    }
    const trackId = track.typeId;

    // Filter out the papers and metadata
    const proceedings = `uist${year}`;
    const papers = data.contents
      .filter(paper => paper.typeId === trackId) 
      .map(paper => {
        const authors = paper.authors.map(author => {
          const person = data.people.find(person => person.id === author.personId);
          return person ? `${person.firstName} ${person.lastName}` : null;
        }).filter(Boolean);
  
        const institutions = paper.authors.map(author => {
          const institution = author.affiliations[0]?.institution || '';
          return institution ? institution : null;
        }).filter(Boolean);
  
        const countries = paper.authors.map(author => {
          const country = author.affiliations[0]?.country || '';
          return country ? country : null;
        }).filter(Boolean);
  
        return {
          author: authors,
          institution: institutions,
          country: countries,
          url: paper.addons.doi?.url || '',
          title: paper.title
        };
      });
    return { proceedings, papers };
  }
  
// Iterate over relevant years
const years = [];
for (let year = startYear; year <= endYear; year++) {
      years.push(year);
}

// Transform data for each year and for all
const all = [];
for (const year of years)
{
    const name = `UIST_20${year}_program`;    
    const file = path.join(inDir, `${name}.json`);
    const data = require(`./` + file);
    
    const transformedData = transformData(data, year);
    all.push(transformedData);

    // write a yearly file
    const yearData = JSON.stringify(transformedData, null, 2)
    const outputFile = path.join(outDir, 'uist'+`${year}`+'.json');
    console.log(`Writing output to - > ${outputFile}`);
    fs.writeFile(outputFile, yearData, (err) => {
        if (err) return console.log(err);
      });
}
const outputFile = path.join(outDir, 'dataset.json');
console.log(`Writing output to - > ${outputFile}`);
    fs.writeFile(outputFile, JSON.stringify(all, null, 2), (err) => {
        if (err) return console.log(err);
    });