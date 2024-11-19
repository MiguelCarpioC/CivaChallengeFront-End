import React, { useState, useEffect } from 'react';
import './BusTable.css';

// Definir la interfaz para el tipo de datos Bus
interface Bus {
  id: number;
  busNumber: string;
  plate: string;
  feature: string;
  brandBus: string;
  status: string;
}

function BusTable() {
  const [buses, setBuses] = useState<Bus[]>([]); // Array de buses
  const [searchId, setSearchId] = useState<string>(''); // Id para la búsqueda
  const [filteredBus, setFilteredBus] = useState<Bus | null>(null); // Bus filtrado
  const [currentPage, setCurrentPage] = useState<number>(1); // Página actual
  const busesPerPage = 10; // Número de buses por página

  useEffect(() => {
    // Fetch data from the API to get all buses
    fetch('http://localhost:8080/api/v1/buses')
      .then(response => response.json())
      .then((data: Bus[]) => setBuses(data))
      .catch(error => console.error('Error fetching buses:', error)) ;
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchId(e.target.value);
    setFilteredBus(null); // Reset filtered bus when the input value changes
  };

  const handleSearch = () => {
    if (searchId.trim() === '') return;

    // Fetch data from the API to get the bus by ID
    fetch(`http://localhost:8080/api/v1/buses/${searchId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Bus not found');
        }
        return response.json();
      })
      .then((data: Bus) => setFilteredBus(data))
      .catch(error => {
        console.error('Error fetching bus by ID:', error);
        setFilteredBus(null);
      });
  };

  // Handle click on a row to show an alert with bus details
  const handleRowClick = (bus: Bus) => {
    alert(`Bus ID: ${bus.id}\nNúmero de Bus: ${bus.busNumber}\nPlaca: ${bus.plate}\nCaracterística: ${bus.feature}\nMarca: ${bus.brandBus}\nEstado: ${bus.status}\n`);
  };

  // Calculate the buses to show on the current page
  const indexOfLastBus = currentPage * busesPerPage;
  const indexOfFirstBus = indexOfLastBus - busesPerPage;
  const currentBuses = buses.slice(indexOfFirstBus, indexOfLastBus);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(buses.length / busesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h1 className="title">Lista de Buses</h1>

      {/* Search by ID */}
      <div className="search-bar">
        <input
          type="number"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Buscar</button>
      </div>

      <table className="bus-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número de Bus</th>
            <th>Placa</th>
            <th>Característica</th>
            <th>Marca</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredBus ? (
            <tr key={filteredBus.id} onClick={() => handleRowClick(filteredBus)}>
              <td>{filteredBus.id}</td>
              <td>{filteredBus.busNumber}</td>
              <td>{filteredBus.plate}</td>
              <td>{filteredBus.feature}</td>
              <td>{filteredBus.brandBus}</td>
              <td>{filteredBus.status}</td>
            </tr>
          ) : (
            currentBuses.map((bus: Bus) => (
              <tr key={bus.id} onClick={() => handleRowClick(bus)}>
                <td>{bus.id}</td>
                <td>{bus.busNumber}</td>
                <td>{bus.plate}</td>
                <td>{bus.feature}</td>
                <td>{bus.brandBus}</td>
                <td>{bus.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {pageNumbers.map((number: number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BusTable;
