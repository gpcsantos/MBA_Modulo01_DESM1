import { format, isDate} from 'date-fns';

// https://covid-api.com/api/provinces/BRA?order=name&sort=asc - pais  e estados

// https://covid-api.com/api/reports?date=2021-04-16&iso=BRA&region_province=alagoas - report por paiz e provincia

const dateSearch = document.getElementById("data-date");
const btnAdd = document.getElementById("bntAdd");
const btnRemove = document.getElementById("bntRemove");
const confirmed = document.getElementById('confirmed');
const death = document.getElementById("death");
const recovered = document.getElementById("recovered");
const dateUpdate = document.getElementById("date-update");
const estado = document.getElementById("estado");


window.addEventListener('DOMContentLoaded', (event)=>{

    // vairiáveis
    let date;
    let urlBrasil = 'https://covid-api.com/api/reports/total?iso=BRA&date=';
    let urlProvincias = 'https://covid-api.com/api/provinces/BRA?order=name&sort=asc';
    let rulGetTotals = 'https://covid-api.com/api/reports?date=2021-04-16&iso=BRA&region_province=alagoas';
    let url;
    let data;
    let title = [];
    let actives =[];
    let deaths = [];
    let confirmeds = [];
    let fatalityRate = [];
    let color = [];

    
    dateSearch.addEventListener('blur', changeDate);
    // dateSearch.addEventListener('change', clearGraphs);
    btnAdd.addEventListener('click', addData);
    btnRemove.addEventListener('click', removeData);
    
    function getDate(){
        date = dateSearch.value;        
        if(!checkDate()){
            return false;
        }
        let dateArr = date.split("-");
        date = format(new Date(dateArr[0], dateArr[1]-1, dateArr[2]),'yyyy-MM-dd');
        return true;
    }

    function changeDate(){
        if (!getDate()){            
            return false;
        }
        
        // getDate();
        
        url = urlBrasil + date;
        // console.log(url);
        getReport();
        preencheDadosBrasil();
        clearGraphs();
        // console.log("update CHARTS");
        // clearGraphs();
    }
    function addData(){
        setTimeout(()=>{
            if(!checkDate()){
                return;
            }
            let province = estado.value;
            url = `https://covid-api.com/api/reports?date=${date}&iso=BRA&region_province=${province}`;
            // console.log(url);
        
            getReport();
            addDataGraphs();
            

            

        },2000)
        
    }
    function clearGraphs(){
        // console.log('clear');
        // barChart.data.labels.pop();
        // barChart.data.datasets.forEach((dataset) => {
        //     dataset.data.pop();
        // });
        title.splice(0,title.length);
        actives.splice(0,actives.length);
        deaths.splice(0,deaths.length);
        confirmeds.splice(0,confirmeds.length);
        fatalityRate.splice(0,fatalityRate.length);
        color.splice(0, color.length);

        barChart.update();
        pizzaChart.update();
    }
    function addDataGraphs(){
        setTimeout(()=>{
            console.log(data.data[0]);
                  
            title.push(estado.value);
            actives.push(data.data[0].active);
            deaths.push(data.data[0].deaths);
            confirmeds.push(data.data[0].confirmed);
            fatalityRate.push(data.data[0].fatality_rate * 100);
            color.push(randomColor());
            // console.log(title);
            // console.log(actives);
            // console.log(deaths);
            // console.log(confirmeds);
            // console.log(actives);
            // console.log(fatalityRate);
            // console.log(color);
            barChart.update();
            pizzaChart.update();
        },1000)
        
        
        
    }
    function removeData(){
        alert('Click remove');
    }
    function checkDate(){
        // console.log(date);
        if(!date && !isDate(date)){
            console.log("ERRO: Data Inválida");
            return false;
        }else{
            return true;
        }
    }
    async function getReport(){

        // console.log(url);
        let res = await axios.get(url);
        
        // console.log(res.data);
        data = res.data;
        // console.log(data);
        // return res.data;
    }

    async function getProvinces(){
        let res = await axios.get(urlProvincias);
        let provinces = res.data;
        setTimeout(() => {
            for(const province of provinces.data){
                if(province.province && province.province!="Unknown" ){
                    let op = document.createElement("option");
                    op.text = province.province;
                    estado.add(op);   
                }
            }
        },1000);
        
    }

    function preencheDadosBrasil(){
        setTimeout(() => {
            confirmed.textContent = data.data.confirmed;
            death.textContent = data.data.deaths;
            recovered.textContent = data.data.recovered;
            dateUpdate.textContent = `Data de atualização: ${date}`;
        }, 2500);
        
        
    }
    function randomColor(){
        function random(number){
            return Math.floor(Math.random() * (number + 1));
        }
        return`rgb(${random(255)},${random(255)},${random(255)})`;
    }

    const bar = document.getElementById('barras');
    let barChart =  new Chart(bar, {
        type: 'bar',
        data: {
            labels: title,
            datasets: [
                {
                    label: 'Ativos',
                    data: actives,
                    borderWidth: 1,
                    backgroundColor: "#5c5c5c"
                },
                {
                    label: 'Mortes',
                    data: deaths,
                    borderWidth: 1,
                    backgroundColor: "#00ff00"
                },
                {
                    label: 'Confirmados',
                    data: confirmeds,
                    borderWidth: 1,
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
                    text: `Dados covid - Estados`
                }
            },
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });
    const piz = document.getElementById('pizza');
    let pizzaChart =  new Chart(piz, {
        type: 'pie',
        data: {
            labels: title,
            datasets: [
                {
                    label: 'Ativos',
                    data: fatalityRate,
                    borderWidth: 1,
                    backgroundColor: color
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
                    text: `Dados covid - Estados`
                }
            },
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });
   


    getProvinces();
})