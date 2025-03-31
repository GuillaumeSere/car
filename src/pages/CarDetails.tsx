import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, Gauge, Mail, Phone } from 'lucide-react';

interface Car {
    id: string;
    title: string;
    description: string;
    price: number;
    year: number;
    mileage: number;
    images: string[];
    created_at: string;
    phoneNumber: string;
    email: string;
}

export default function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCar() {
            try {
                const { data, error } = await supabase
                    .from('cars')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setCar(data);
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="text-center text-gray-600">
                <p>Annonce non trouvée</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{car.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    {car.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${car.title} - Image ${index + 1}`}
                            className="w-full rounded-lg shadow-md"
                        />
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl m-5 font-bold text-blue-600 mb-4">
                            {car.price.toLocaleString('fr-FR')} €
                        </div>

                        <div className="flex-col items-center justify-between mb-4">
                            <div className="flex items-center m-5 space-x-2 text-gray-600">
                                <Calendar className="h-5 w-5" />
                                <span>{car.year}</span>
                            </div>
                            <div className="flex items-center m-5 space-x-2 text-gray-600">
                                <Gauge className="h-5 w-5" />
                                <span>{car.mileage.toLocaleString('fr-FR')} km</span>
                            </div>
                            {car.phoneNumber && (
                                <div className="text-gray-600 m-5 mb-4">
                                    <p className="flex items-center gap-2">
                                        <Phone className="h-5 w-5" />
                                        {car.phoneNumber}
                                    </p>
                                </div>
                            )}
                                 {car.email && (
                                    <div className="text-gray-600 m-5 mb-4">
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-5 w-5" /> 
                                            {car.email}
                                        </p>
                                    </div>
                                )}
                        </div>

                        <p className="text-gray-600 m-5">{car.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 