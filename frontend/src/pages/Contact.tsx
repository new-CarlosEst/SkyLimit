import { useState } from 'react';
import personIcon from '../assets/ui/ProiconsPerson.svg';
import emailIcon from '../assets/ui/mail.svg';
import speechBubble from '../assets/ui/speechBubble.svg';
import textIcon from '../assets/ui/text.svg';
import { sendContact } from '../api/mail.api';
import { sileo } from 'sileo';

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        theme: "",
        message: "",
    });

    //TODO: ver pq no saltan los toast
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await sendContact(formData);
            sileo.success({title: "Mensaje enviado correctamente"});
            // Limpiar formulario
            setFormData({
                name: "",
                surname: "",
                email: "",
                theme: "",
                message: "",
            });
        } catch (error) {
            sileo.error({title: "Error al enviar el mensaje"});
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="contact-container pt-16 bg-linear-to-br from-[#2c5aa0] to-[#1e3a6f] min-h-screen py-16 px-4">
            {/* Encabezado */}
            <div className="py-8 max-w-2xl mx-auto text-center mb-12">
                <h1 className="text-6xl font-bold text-white mb-6">
                    Contacta con Nosotros
                </h1>
                <p className="text-xl text-blue-200 leading-relaxed">
                    ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte. 
                    Completa el formulario y te responderemos lo antes posible.
                </p>
            </div>

            {/* Tarjeta del Formulario */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-center font-semibold ${
                        message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Nombre y Apellidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3">
                                Nombre
                            </label>
                            <div className="relative flex items-center">
                                <img 
                                    src={personIcon} 
                                    alt="person-icon" 
                                    className="absolute left-4 w-5 h-5 pointer-events-none"
                                />
                                <input 
                                    type="text" 
                                    id="name" 
                                    placeholder="Introduce tu nombre..." 
                                    autoComplete="off"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0] focus:border-transparent transition placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Apellidos */}
                        <div>
                            <label htmlFor="surname" className="block text-sm font-semibold text-gray-800 mb-3">
                                Apellidos
                            </label>
                            <div className="relative flex items-center">
                                <img 
                                    src={personIcon} 
                                    alt="person-icon" 
                                    className="absolute left-4 w-5 h-5 pointer-events-none"
                                />
                                <input 
                                    type="text" 
                                    id="surname" 
                                    placeholder="Introduce tus apellidos..." 
                                    autoComplete="off"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0] focus:border-transparent transition placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
 
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
                            Correo Electrónico
                        </label>
                        <div className="relative flex items-center">
                            <img 
                                src={emailIcon} 
                                alt="email-icon" 
                                className="absolute left-4 w-5 h-5 pointer-events-none"
                            />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Introduce tu email..." 
                                autoComplete="off"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0] focus:border-transparent transition placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Tema */}
                    <div>
                        <label htmlFor="theme" className="block text-sm font-semibold text-gray-800 mb-3">
                            Tema
                        </label>
                        <div className="relative flex items-center">
                            <img 
                                src={speechBubble} 
                                alt="speech-icon" 
                                className="absolute left-4 w-5 h-5 pointer-events-none"
                            />
                            <input 
                                type="text" 
                                id="theme" 
                                placeholder="Introduce el tema..." 
                                autoComplete="off"
                                value={formData.theme}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0] focus:border-transparent transition placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Mensaje */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-3">
                            Mensaje
                        </label>
                        <div className="relative flex">
                            <img 
                                src={textIcon} 
                                alt="text-icon" 
                                className="absolute left-4 top-4 w-5 h-5 pointer-events-none"
                            />
                            <textarea 
                                id="message"
                                placeholder="Introduce tu mensaje..." 
                                rows={5}
                                autoComplete="off"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c5aa0] focus:border-transparent transition placeholder-gray-400 resize-none"
                            />
                        </div>
                    </div>

                    {/* Botón Enviar */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2563eb] hover:bg-[#1e40af] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        {loading ? "Enviando..." : "Enviar mensaje"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Contact;