import React, { useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import axios from 'axios';
import './FileUpload.css';
// Inclua o script do worker diretamente no JavaScript
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs`;

// Restante do código do componente PdfUploader...

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState('');
    const [mensagem, setMensagem] = useState('');

    const extractnCliente = (text) => {
        const regex = /Nº DA INSTALAÇÃO\s*\s*(\d+)/g;
        const matches = regex.exec(text);
        return matches ? matches[1] : null;
    };
    const extractMes = (text) => {
        const regex = /[A-Z]{3}\/\d{4}/g;
        const matches = regex.exec(text);
        return matches ? matches[0] : null;
    };
    const extractEnergiaValor = (text) => {
        const regex = /-?\d*,\d+/g;
        const matches = text.match(regex);
        console.log("matches: ",matches);
        return matches[1];
    };
    const extractEnergiaQuant = (text) => {
        const regex = /Energia Elétrica kWh\s+(\d+\.?\d+)/g;
        const matches = regex.exec(text);
        console.log("Matches:", matches);
        return matches ? matches[1] : null;
    };
    const extractSceekwhQuant = (text) => {
        const regex = /Energia SCEE ISENTA kWh\s+(\d+\.?\d+)/g;
        const matches = regex.exec(text);
        console.log("Matches:", matches); // Verifica se houve correspondência com a expressão regular
        return matches ? matches[1] : null;
    };
    const extractSceekwhValor = (text) => {
        const regex = /Energia SCEE ISENTA kWh\s+\d+\s+\d*,\d+\s+(-?\d*,\d+)/g;
        const matches = regex.exec;
        console.log("matches: ",matches);
        return matches ? matches[1] : null;
    };
    const extractCompensadakwhQuant = (text) => {
        const regex = /Energia compensada GD I kWh\s+(\d+\.?\d+)/g;
        const matches = regex.exec(text);
        console.log("Matches:", matches); // Verifica se houve correspondência com a expressão regular
        return matches ? matches[1] : null;
    };
    const extractCompensadakwhValor = (text) => {
        const regex = /Energia compensada GD I kWh\s+\d+\s+\d*,\d+\s+(-?\d*,\d+)/g;
        const matches = regex.exec(text);
        console.log("matches: ",matches);
        return matches ? matches[1] : null;
    };
    const extractContribuicaoIlumMunicipal = (text) => {
        const regex = /Contrib Ilum Publica Municipal\s+(\d+,\d+)/g;
        const matches = regex.exec(text);
        console.log("Matches:", matches); // Verifica se houve correspondência com a expressão regular
        return matches ? matches[1] : null;
    };
    const extractValorTotalFat = (text) => {
        const regex = /TOTAL\s*(\d*,\d+)/g;
        const matches = regex.exec(text);
        console.log("matches: ",matches);
        return matches[1];
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    const handleFileIncluir = () =>{
        if (selectedFile) {
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const typedArray = new Uint8Array(fileReader.result);
                const pdf = await getDocument(typedArray).promise;
                const page = await pdf.getPage(1);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map(item => item.str).join('');
                console.log("Text Content:", textItems); // Verifica se o texto do PDF está sendo extraído corretamente
                const numcliente = extractnCliente(textItems);
                const mesreferencia = extractMes(textItems);
                const energiakwhvalor = extractEnergiaValor(textItems);
                const energiakwhquantidade = extractEnergiaQuant(textItems);
                const sceekwhquantidade = extractSceekwhQuant(textItems);
                const sceekwhvalor = extractSceekwhValor(textItems);
                const compensadakwhquantidade = extractCompensadakwhQuant(textItems);
                const compensadakwhvalor = extractCompensadakwhValor(textItems);
                const contribuicaoilummunicipal = extractContribuicaoIlumMunicipal(textItems);
                const valortotalfatura = extractValorTotalFat(textItems);
               
                if(sceekwhvalor != null){
                    var sceekwhvalorrep = sceekwhvalor.replace(',','.');
                };
                if(compensadakwhvalor != null){
                    var compensadakwhvalorrep = compensadakwhvalor.replace(',','.');
                };
                try {
                    const response = await axios.post('http://localhost:5000/upload', {
                        numcliente: numcliente,
                        mesreferencia: mesreferencia,
                        energiakwhquantidade: energiakwhquantidade.replace('.',''),
                        energiakwhvalor: energiakwhvalor.replace(',','.'),
                        sceekwhquantidade: sceekwhquantidade,
                        sceekwhvalor: sceekwhvalorrep,
                        compensadakwhquantidade: compensadakwhquantidade,
                        compensadakwhvalor: compensadakwhvalorrep,
                        contribuicaoilummunicipal: contribuicaoilummunicipal.replace(',','.'),
                        valortotalfatura: valortotalfatura.replace(',','.')
                    });
                    setMensagem(response.data.message);
                    console.log('Resposta do servidor:', response.data);
                } catch (error) {
                    console.error('Erro ao enviar dados para o servidor:', error);
                }
            };
            fileReader.readAsArrayBuffer(selectedFile);
        }
    };

    
    return (
        <div className=''>
            <h1>PDF Uploader</h1>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} />
            <button onClick={handleFileIncluir}>Incluir</button>
            <div>
                {mensagem && <h2><p> {mensagem}</p></h2>}
            </div>
        </div>
    );
};

export default FileUpload;
