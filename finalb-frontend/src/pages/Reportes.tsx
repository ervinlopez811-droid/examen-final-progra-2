import React, { useState, useRef } from 'react';
import { exportarTablaPDF, exportarTablaExcel } from '../utils/exportUtils';

const BASE_URL = 'http://localhost:8080';

export const Reportes: React.FC = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const abrirDialogFiltro = () => {
    setFiltroNombre('');
    dialogRef.current?.showModal();
  };

  const cerrarDialogFiltro = () => {
    dialogRef.current?.close();
  };

  const obtenerArticulosFiltrados = async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/articulos/mostrarActivosFiltro?nombre=${encodeURIComponent(filtroNombre)}`);
    return await res.json();
  };

  const exportarReporte1PDF = async (e: React.MouseEvent) => {
    e.preventDefault();
    const data = await obtenerArticulosFiltrados();
    const cols = ['ID', 'Nombre', 'Marca', 'Precio (Q)', 'Stock'];
    const rows = data.map((art) => [
      art.idArticulo,
      art.nombre,
      art.marca,
      `Q${Number(art.precio).toFixed(2)}`,
      art.stock
    ]);
    exportarTablaPDF(`Reporte de Artículos (Filtro: "${filtroNombre}")`, cols, rows, 'Reporte_Articulos_Filtro');
    cerrarDialogFiltro();
  };

  const exportarReporte1Excel = async (e: React.MouseEvent) => {
    e.preventDefault();
    const data = await obtenerArticulosFiltrados();
    const cols = ['ID', 'Nombre', 'Marca', 'Precio', 'Stock'];
    const rows = data.map((art) => [
      art.idArticulo,
      art.nombre,
      art.marca,
      Number(art.precio),
      art.stock
    ]);
    await exportarTablaExcel(`Reporte de Artículos (Filtro: "${filtroNombre}")`, cols, rows, 'Reporte_Articulos_Filtro');
    cerrarDialogFiltro();
  };

  const obtenerArticulosCategoria = async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/articulos/reporteArticulocategoria`);
    return await res.json();
  };

  const exportarReporte2PDF = async () => {
    const data = await obtenerArticulosCategoria();
    const cols = ['Categoría', 'Artículo', 'Marca', 'Precio (Q)', 'Stock'];
    const rows = data.map((item) => [
      item.nombreCategoria,
      item.nombreArticulo,
      item.marca,
      `Q${Number(item.precio).toFixed(2)}`,
      item.stock
    ]);
    exportarTablaPDF('Reporte de Artículos por Categoría', cols, rows, 'Reporte_Articulos_Categoria');
  };

  const exportarReporte2Excel = async () => {
    const data = await obtenerArticulosCategoria();
    const cols = ['Categoría', 'Artículo', 'Marca', 'Precio', 'Stock'];
    const rows = data.map((item) => [
      item.nombreCategoria,
      item.nombreArticulo,
      item.marca,
      Number(item.precio),
      item.stock
    ]);
    await exportarTablaExcel('Reporte de Artículos por Categoría', cols, rows, 'Reporte_Articulos_Categoria');
  };

  const obtenerClientesFacturas = async (): Promise<any[]> => {
    const res = await fetch(`${BASE_URL}/clientes/reporteClienteFactura`);
    return await res.json();
  };

  const exportarReporte3PDF = async () => {
    const data = await obtenerClientesFacturas();
    const cols = ['Cliente (Nombre y Apellido)', 'NIT', 'Fecha Factura', 'Total (Q)'];
    const rows = data.map((item) => [
      `${item.nombre} ${item.apellido}`,
      item.nit,
      new Date(item.fechaFactura).toLocaleString('es-GT'),
      `Q${Number(item.total).toFixed(2)}`
    ]);
    exportarTablaPDF('Reporte de Facturas por Cliente', cols, rows, 'Reporte_Facturas_Cliente');
  };

  const exportarReporte3Excel = async () => {
    const data = await obtenerClientesFacturas();
    const cols = ['Cliente (Nombre y Apellido)', 'NIT', 'Fecha Factura', 'Total'];
    const rows = data.map((item) => [
      `${item.nombre} ${item.apellido}`,
      item.nit,
      new Date(item.fechaFactura).toLocaleString('es-GT'),
      Number(item.total).toFixed(2)
    ]);
    await exportarTablaExcel('Reporte de Facturas por Cliente', cols, rows, 'Reporte_Facturas_Cliente');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#0f0a1a', minHeight: '100vh', color: '#f3e8ff' }}>
      <h1 style={{ color: '#d8b4fe', textAlign: 'center', textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
        Módulo de Reportes - Ferretería
      </h1>
      <p style={{ textAlign: 'center', color: '#c084fc', marginBottom: '30px' }}>
        Selecciona la opción deseada para generar la descarga en PDF o Excel.
      </p>

      <hr style={{ borderColor: '#581c87', margin: '20px 0 40px 0' }} />

      <div style={{ display: 'grid', gap: '25px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        
        {/* Tarjeta 1 */}
        <div style={{ backgroundColor: '#1e1b4b', border: '1px solid #7c3aed', padding: '25px', borderRadius: '12px', boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)' }}>
          <h3 style={{ color: '#e879f9', marginTop: 0 }}>1. Artículos por Nombre</h3>
          <p style={{ color: '#cbd5e1' }}>Filtrar por texto con ventana emergente dialog.</p>
          <button 
            onClick={abrirDialogFiltro} 
            style={{ padding: '10px 16px', backgroundColor: '#9333ea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 10px rgba(147, 51, 234, 0.4)' }}
          >
            Abrir Filtro
          </button>
        </div>

        {/* Tarjeta 2 */}
        <div style={{ backgroundColor: '#1e1b4b', border: '1px solid #7c3aed', padding: '25px', borderRadius: '12px', boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)' }}>
          <h3 style={{ color: '#e879f9', marginTop: 0 }}>2. Artículos con su Categoría</h3>
          <p style={{ color: '#cbd5e1' }}>Ordenados por categoría y nombre del artículo.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            <button onClick={exportarReporte2PDF} style={{ padding: '8px 14px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>PDF</button>
            <button onClick={exportarReporte2Excel} style={{ padding: '8px 14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Excel</button>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div style={{ backgroundColor: '#1e1b4b', border: '1px solid #7c3aed', padding: '25px', borderRadius: '12px', boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)' }}>
          <h3 style={{ color: '#e879f9', marginTop: 0 }}>3. Facturas por Cliente</h3>
          <p style={{ color: '#cbd5e1' }}>Nombre y apellido juntos, totales con 2 decimales.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            <button onClick={exportarReporte3PDF} style={{ padding: '8px 14px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>PDF</button>
            <button onClick={exportarReporte3Excel} style={{ padding: '8px 14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Excel</button>
          </div>
        </div>

      </div>

      {/* Modal Dialog */}
      <dialog ref={dialogRef} style={{ padding: '30px', borderRadius: '12px', border: '2px solid #a855f7', backgroundColor: '#1e1b4b', color: '#f3e8ff', width: '380px', boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)' }}>
        <h3 style={{ color: '#e879f9', marginTop: 0 }}>Filtrar Artículos por Nombre</h3>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="Ingrese nombre..."
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#0f0a1a', border: '1px solid #a855f7', color: 'white', borderRadius: '6px', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={exportarReporte1PDF} style={{ padding: '8px 12px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Exportar PDF
          </button>
          <button onClick={exportarReporte1Excel} style={{ padding: '8px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Exportar Excel
          </button>
          <button onClick={cerrarDialogFiltro} style={{ padding: '8px 12px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cancelar
          </button>
        </div>
      </dialog>
    </div>
  );
};