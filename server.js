const express = require('express');
const axios = require('axios');
const morgan = require('morgan')
const app = express();
const PORT = 2500;

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));

app.get('/country-info', async (req, res) => {
    const country = req.query.name;
    const query = `
        SELECT ?capitalLabel ?population ?currencyLabel WHERE {
            ?country rdfs:label "${country}"@en.
            ?country wdt:P36 ?capital;
                     wdt:P1082 ?population;
                     wdt:P38 ?currency.
            SERVICE wikibase:label {bd:serviceParam wikibase:language "en". }
        }
    `;

    try{
        const response = await axios.get('https://query.wikidata.org/sparql', {
            params:{
                query,
                format: 'json'
            },
            headers:{
                'Accept': 'application/sparql-results+json'
            }
        });

        const bindings = response.data.results.bindings;
        if(bindings.length > 0){
            const info = bindings[0];
            res.json({
                capital: info.capitalLabel.value,
                population: info.population.value,
                currency: info.currencyLabel.value,
            });
        } else{
            res.status(404).json({ error: 'country not found or data unavailable.' });
        }
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Error fetching data from wikidata.'});
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));