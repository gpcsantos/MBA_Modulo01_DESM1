const ctx = document.getElementById('barras-teste');
let title = ['São Paulo', 'Rio de Janeiro'];
let actives =[1654,8383];
let deaths = [1249,1516];
let cofirmeds = [6262,8281] 
new Chart(ctx, {
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
            data: cofirmeds,
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
            text: "Dados covid - Estados"
        }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});