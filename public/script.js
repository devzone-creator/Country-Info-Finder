async function getCountryInfo(e){
    const name = document.getElementById('country').value.trim();
    const resultDiv = document.getElementById('result');

    if(!name) return;

    resultDiv.innerHTML = 'Loading...';
    try{
        const res = await fetch(`/country-info?name=${encodeURIComponent(name)}`);
        const data = await res.json();

        if(data.error){
            resultDiv.innerHTML = `<p>${data.error}</p>`;
        } else{
            resultDiv.innerHTML = `
                <p><strong>Capital:</strong>${data.capital}</p>
                <p><strong>Population:</strong>${Number(data.population).toLocaleString()}</p>
                <p><strong>Currency:</strong>${data.currency}</p>
            `
        }
    } catch(err){
        resultDiv.innerHTML = `<p>Error fetching data</p>`
    }
}