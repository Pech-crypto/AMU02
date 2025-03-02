import { useState, useEffect } from "react";

function Agregar() {
  const [data, setData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("actividades");
    if (storedData) {
      setActividades(JSON.parse(storedData));
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setEditingIndex(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setData({});
  };

  const handleSave = () => {
    if (!data.title || !data.description || !data.status || !data.date) {
      return;
    }

    let nuevasActividades;
    if (editingIndex !== null) {
      nuevasActividades = [...actividades];
      nuevasActividades[editingIndex] = data;
    } else {
      nuevasActividades = [...actividades, data];
    }

    localStorage.setItem("actividades", JSON.stringify(nuevasActividades));
    setActividades(nuevasActividades);
    setIsOpen(false);
    setData({});
  };

  const handleEdit = (index) => {
    const actividad = actividades[index];
    setData(actividad);
    setIsOpen(true);
    setEditingIndex(index);
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const tareasFiltradas = actividades.filter((actividad) => {
    if (filtro === "todas") return true;
    return actividad.status === filtro;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={handleOpen}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Agregar actividad
      </button>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por estatus:
        </label>
        <select
          value={filtro}
          onChange={handleFiltroChange}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendiente</option>
          <option value="en proceso">En proceso</option>
          <option value="terminada">Terminada</option>
        </select>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividades Guardadas</h2>
        {tareasFiltradas.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tareasFiltradas.map((actividad, index) => (
              <li
                key={index}
                onDoubleClick={() => handleEdit(actividades.indexOf(actividad))}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <p className="text-lg font-semibold text-gray-800">{actividad.title}</p>
                <p className="text-sm text-gray-600 mt-2">{actividad.description}</p>
                <div className="mt-4">
                  <span
                    className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                      actividad.status === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : actividad.status === "en proceso"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {actividad.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">Fecha: {actividad.date}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay actividades guardadas.</p>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800">
                {editingIndex !== null ? "Editar Actividad" : "Nueva Actividad"}
              </h1>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la tarea:
                </label>
                <input
                  type="text"
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción:
                </label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estatus:
                </label>
                <select
                  value={data.status || ""}
                  onChange={(e) => setData({ ...data, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un estatus</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en proceso">En proceso</option>
                  <option value="terminada">Terminada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha:
                </label>
                <input
                  type="date"
                  value={data.date || ""}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end p-6 border-t">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                {editingIndex !== null ? "Guardar Cambios" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agregar;