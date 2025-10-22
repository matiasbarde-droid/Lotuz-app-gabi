// src/pages/client/Profile.jsx (VERSION FINAL) 
import React, { useState } from 'react'; 
import { useAuth } from '../../context/AuthContext'; 
import ProfileForm from '../../components/client/ProfileForm'; // Asumiendo que ProfileForm existe 
import OrderHistory from '../../components/client/OrderHistory'; // <--- IMPORTACIÓN NUEVA 
 
export default function Profile() { 
  const { user, isLoggedIn } = useAuth(); 
  const [view, setView] = useState('info'); // 'info' o 'edit' 
 
  if (!isLoggedIn) { 
    // Si no está logueado, redirigir al login (el AuthContext debería manejar esto, pero es buena práctica) 
    return <div className="container" style={{paddingTop: '50px'}}><p>Acceso denegado. Por favor, inicia sesión.</p></div>; 
  } 
 
  // Se asume que ProfileForm está implementado para la edición de datos 
  // ... 
 
  return ( 
    <main className="container" style={{ padding: '18px 16px 32px' }}> 
      <h1 className="titulo-seccion" style={{ marginTop: 0 }}> 
        Mi Perfil - {user.nombre} 
      </h1> 
 
      <section className="profile-actions" style={{ marginBottom: 20 }}> 
        <button 
          className={`btn ${view === 'info' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setView('info')} 
        > 
          Información de Cuenta 
        </button> 
        <button 
          className={`btn ${view === 'edit' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setView('edit')} 
        > 
          Editar Datos 
        </button> 
      </section> 
 
      {/* VISTA: INFORMACIÓN DE CUENTA */} 
      {view === 'info' && ( 
        <section className="card"> 
          <div className="card-body"> 
            <h2 className="text-large">Datos Personales</h2> 
            <p><strong>Nombre:</strong> {user?.nombre || user?.name}</p> 
            <p><strong>Email:</strong> {user?.email}</p> 
            <p><strong>Teléfono:</strong> {user.telefono || 'No especificado'}</p> 
            <p><strong>Dirección:</strong> {user.direccion || 'No especificado'}</p> 
            // Removed role display for client consistency
             
          </div> 
          
          {/* SECCIÓN DE HISTORIAL DE COMPRAS */} 
          <OrderHistory /> {/* <--- INTEGRACIÓN FINAL DEL HISTORIAL */} 
 
        </section> 
      )} 
 
      {/* VISTA: EDITAR DATOS (Asumiendo que ProfileForm existe) */} 
      {view === 'edit' && ( 
        <section className="card"> 
          <ProfileForm user={user} onUpdateSuccess={() => setView('info')} /> 
        </section> 
      )} 
 
    </main> 
  ); 
}