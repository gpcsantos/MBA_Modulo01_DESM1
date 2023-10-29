import { addDays, format } from 'date-fns';
let datasAmostra = [];
let confirmados = [];
let obitos = [];
let recuperados = [];
let ativos = [];
let taxaFatalidade = [];
let confirmadosDescartados = [];
let dataChart = [];
let nameArrays = ['confirmados','obitos','recuperados','ativos','taxaFatalidade','confirmadosDescartados'];

window.addEventListener('DOMContentLoaded', (event)=>{

    //variáveis
    const urlContries= "https://covid-api.com/api/regions?order=name";
    const urlReport = 'https://covid-api.com/api/reports/total';
    const cboCountry = document.getElementById('cmbCountry');
    const dateStart = document.getElementById('date_start');
    const dateEnd = document.getElementById('date_end');
    const btnFiltro = document.getElementById('filtro');
    const cboData = document.getElementById('cmbData');
    const cboDateItem = document.getElementById('date-item');
    const kpiDeaths = document.getElementById('kpideaths');
    const kpiRecovered = document.getElementById('kpirecovered');
    const kpiConfirmed = document.getElementById('kpiconfirmed');

    let lineChart = null;
    let tituloGrafico = null;
    
    btnFiltro.addEventListener('click', getDataReport);
    cboData.addEventListener('change', changeDataChart);
    cboDateItem.addEventListener('change', changeDataItens);

    cboData.disabled = true;
    cboDateItem.disabled = true;

    function strToDate(date){
        let d = date.split('-')
        return new Date(d[0], d[1]-1, d[2]);
    }

    async function getReport(url){
        let res = await axios.get(url);
        return res.data;
    }

    function limpaArrays(){
        datasAmostra.splice(0,datasAmostra.length);
        obitos.splice(0,obitos.length);
        confirmados.splice(0,confirmados.length);
        recuperados.splice(0,recuperados.length);
        ativos.splice(0,ativos.length);
        taxaFatalidade.splice(0,taxaFatalidade.length);
    }

    async function getDataReport(){
        let country = cboCountry.value;
        let dataInicio = strToDate(dateStart.value);
        let dataFim = strToDate(dateEnd.value);
        let dias = (dataFim - dataInicio) / (60*60*24*1000);
        cboData.disabled = false;
        cboDateItem.disabled = false;
        // console.log(country);
        // console.log(dataInicio);
        limpaArrays();
        for(let i=0; i<=dias; i++){
            let url = `${urlReport}?iso=${country}&date=${format(addDays(dataInicio, i),"yyyy-MM-dd")}`
            //console.log(addDays(dataInicio, i))
            // console.log(url);
            let d = await getReport(url);
            // console.log(d);
            datasAmostra.push(format(addDays(dataInicio, i), 'dd/MM/yyyy'));
            obitos.push(d.data.deaths);
            confirmados.push(d.data.confirmed);
            recuperados.push(d.data.recovered);
            ativos.push(d.data.active);
            taxaFatalidade.push(d.data.fatality_rate*100);
            confirmadosDescartados.push(d.data.confirmed_diff);
        }
        dataChart = [...obitos];
        tituloGrafico = "Número de óbitos";
        listDate();
        changeDataItens();
        updateChart();
    }

    async function getCountries(){
        let countries = await getReport(urlContries)
        for(const country of countries.data){
            let op = document.createElement('option');
            op.text = country.name;
            op.value = country.iso;
            cboCountry.add(op);
        }
    } 

    function listDate(){
        limpaDate();
        for(let i=0; i<datasAmostra.length; i++){
            let op = document.createElement('option');
            op.text = datasAmostra[i];
            op.value = i;
            cboDateItem.add(op);
        }
    }
    
    function limpaDate(){
        let op = document.querySelectorAll('#date-item option');
        op.forEach(o => o.remove());
        changeDataItens();
    }

    function changeDataChart(){
        let index = cboData.value;
        let op = cboData.children[cboData.selectedIndex];
        tituloGrafico = op.textContent;
        let nameArr = nameArrays[index];
        dataChart = [...eval(nameArr)];
        updateChart();
    }
    
    function changeDataItens(){
        // kpiConfirmed
        // kpiDeaths
        // kpiRecovered
        let index = cboDateItem.value;
        kpiConfirmed.textContent = confirmados[index];
        kpiDeaths.textContent = obitos[index];
        kpiRecovered.textContent = recuperados[index];
    }

    function updateChart(){        
        if (lineChart){
            lineChart.destroy();
        }
        const lin = document.getElementById('linhas');
        // console.log(dataChart);
        lineChart =  new Chart(lin, {
            type: 'line',
            data: {
                labels: datasAmostra,
                datasets: [
                    {
                        label: tituloGrafico,
                        data: dataChart,
                        borderWidth: 1,
                        borderColor: "#0000ff",
                        backgroundColor: "#0000ff"
                    }
                ]
            },
            options: {
                responsive: true,
                plugins:{
                    legend:{
                        position: 'bottom'
                    },
                    title:{
                        display:true,
                        text: tituloGrafico
                    }
                },
                scales: {
                y: {
                    beginAtZero: true
                }
                }
            }
            });
            lineChart.update();
    }
    getCountries();

});