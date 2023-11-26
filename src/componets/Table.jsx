import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import MapComponent from "./map";

export default function Table() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function consult() {
      const { data, error } = await supabase.from('measurements').select('*');
      setDatos(data);
      console.log(data);
    } 
    consult();
  }, []);

  return (
    <>
      <div>
        <div style={{ textAlign: 'center' }}>
          <h1 className='text-2xl font-bold'>Registros de Inserciones</h1>
        </div>
        <div style={{textAlign:"center"}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', marginBottom: '50px',textAlign: 'center'}}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Folio. de Registro</th>
                <th style={tableHeaderStyle}>Estación Proveniente</th>
                <th style={tableHeaderStyle}>Latitud</th>
                <th style={tableHeaderStyle}>Longitud</th>
                <th style={tableHeaderStyle}>Temperatura</th>
                <th style={tableHeaderStyle}>Humedad</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dato, index) => (
                <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
                  <td style={tableCellStyle}>{dato.id}</td>
                  <td style={tableCellStyle}>{dato.station_id}</td>
                  <td style={tableCellStyle}>{dato.latitude}</td>
                  <td style={tableCellStyle}>{dato.longitude}</td>
                  <td style={tableCellStyle}>{dato.temperature}</td>
                  <td style={tableCellStyle}>{dato.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{borderRadius:"10px"}}>
            <MapComponent />
        </div>
      </div>
    </>
  );
}

const tableHeaderStyle = {
  backgroundColor: '#58D68D',
  padding: '10px',
  borderRadius: '8px',
  textAlign: 'left',
  border: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '10px',
  borderRadius: '6px',
  textAlign: 'left',
  border: '1px solid #ddd',
};

const evenRowStyle = {
  backgroundColor: '#ABEBC6',
};

const oddRowStyle = {
  backgroundColor: '#D5F5E3',
};
