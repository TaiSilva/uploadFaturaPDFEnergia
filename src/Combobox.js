import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComboBox = ({ onSelectChange }) => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleSelectChange = (event) => {
    onSelectChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="combo">Selecione um cliente:</label>
      <select id="combo" onChange={handleSelectChange}>
        <option value="">Selecione...</option>
        {clientes.map((cliente) => (
          <option key={cliente.numcliente} value={cliente.numcliente}>
            {cliente.numcliente}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboBox;
