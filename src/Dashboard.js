import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './Combobox';
import ComboBox from './Combobox';

Chart.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [totalFatura, setTotalFatura] = useState(null);
  const [consumoenergia, setConsumoEnergia] = useState(null);
  const [consumoscee, setConsumoScee] = useState(null);
  const [somatotalenergiaeletrica, setSomaTotalEnergiaEletrica] = useState(null);
  const [energiacompensada, setEnergiaCompensada] = useState(null);
  const [energiacompensadavalor, setEnergiaCompensadaValor] = useState(null);
  const [chartData, setChartData] = useState({});
  const [selectedCliente, setSelectedCliente] = useState('');

  useEffect(() => {
    const fetchTotalFatura = async () => {
      try {
        console.log(ComboBox.selectedCliente);
        const response = await axios.get('http://localhost:5000/total-fatura', {
          params: { cliente: selectedCliente }
        });
        setTotalFatura(response.data.total_energia);
        console.log("resposta: ",response.data.total_energia);
      } catch (error) {
        console.error('Erro ao buscar o total da fatura:', error);
      }
    };

    fetchTotalFatura();
  }, [selectedCliente]);


  useEffect(() => {
    const fetchConsumoEnergiaEletrica = async () => {
      console.log(selectedCliente);
      try {
        const response = await axios.get('http://localhost:5000/consumo-energia', {
          params: { cliente: selectedCliente }
        });
        setConsumoEnergia(response.data.totalenergia);
        setConsumoScee(response.data.totalscee);
        setSomaTotalEnergiaEletrica(response.data.totalenergiaeletrica);
        const data = {
          labels: ['Consumo kWh Energia Elétrica', 'Consumo kWh Energia SCEE'],
          datasets: [
            {
              label: 'Consumo de Energia',
              data: [response.data.totalenergia, response.data.totalscee],
              backgroundColor: ['#06d6a0', '#ffd166'],
              hoverBackgroundColor: ['#06d6a0', '#ffd166'],
            },
          ],
        };
        setChartData(data);

      } catch (error) {
        console.error('Erro ao buscar o total da fatura:', error);
      }
    };

    fetchConsumoEnergiaEletrica();
  }, [selectedCliente]);

  useEffect(() => {
    const fetchEnergiaCompensada = async () => {
      try {
        const response = await axios.get('http://localhost:5000/energia-compensada', {
          params: { cliente: selectedCliente }
        });
        setEnergiaCompensada(response.data.compensada);
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao buscar o valor total energia compensada:', error);
      }
    };

    fetchEnergiaCompensada();
  }, [selectedCliente]);
  
  useEffect(() => {
    const fetchEnergiaCompensadaValor = async () => {
      try {
        const response = await axios.get('http://localhost:5000/energia-compensadavalor', {
          params: { cliente: selectedCliente }
        });
        setEnergiaCompensadaValor(response.data.compensadakwhvalor);
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao buscar o valor total energia compensada:', error);
      }
    };

    fetchEnergiaCompensadaValor();
  }, [selectedCliente]);

  return (
    <div className="container-body">
      <div className='div-cliente'>
      <ComboBox onSelectChange={setSelectedCliente} />
      </div>
      <div className='row'>
        <div className="container-card">
          <div className="card-container">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total das Faturas</h5>
                <p className="card-text">{totalFatura ? `R$ ${totalFatura}` : 'Carregando...'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="energia-compensadavalor">
          <div className="card-container">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Economia GD</h5>
                <p className="card-text">{energiacompensadavalor ? `R$ ${energiacompensadavalor}` : 'Carregando...'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-graficoPizza">
          <div>
            <h2>Consumo de Energia Elétrica</h2>
              {chartData.datasets && chartData.datasets.length > 0 && (
            <Pie data={chartData} />
            )}
          </div>
        </div>
      </div>
    
      <div className="total-energia">
          <div className="card-container">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total de Consumo de Energia Elétrica</h5>
                <p className="card-text">{somatotalenergiaeletrica ? `kWh ${somatotalenergiaeletrica}` : 'Carregando...'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="energia-compensada">
          <div className="card-container">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Energia compensada</h5>
                <p className="card-text">{energiacompensada ? `kWh ${energiacompensada}` : 'Carregando...'}</p>
              </div>
            </div>
          </div>
        </div>
        
      
    </div>  
    
  );
};

export default Dashboard;
