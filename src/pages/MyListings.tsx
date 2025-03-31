import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Calendar, Gauge, Phone, Trash2, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
    email: string; // Ajout du champ email
}

export default function MyListings() {
    const { user } = useAuth();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMyCars();
        }
    }, [user]);

    async function fetchMyCars() {
        try {
            if (!user) return;

            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCars(data || []);
        } catch (error) {
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(carId: string, imageUrls: string[]) {
        try {
            setLoading(true);
            console.log('Début de la suppression pour carId:', carId);
            console.log('Utilisateur actuel:', user?.id);

            // 1. Vérifier d'abord si l'annonce appartient à l'utilisateur
            const { data: carData, error: carError } = await supabase
                .from('cars')
                .select('*')
                .eq('id', carId)
                .single();

            console.log('Données de l\'annonce:', carData);

            if (carError) {
                throw carError;
            }

            if (carData.user_id !== user?.id) {
                throw new Error('Vous n\'êtes pas autorisé à supprimer cette annonce');
            }

            // 2. Supprimer l'annonce
            const { data: deleteData, error: dbError } = await supabase
                .from('cars')
                .delete()
                .eq('id', carId)
                .eq('user_id', user.id)
                .select();

            console.log('Résultat de la suppression:', { deleteData, dbError });

            if (dbError) {
                throw dbError;
            }

            // 3. Supprimer les images du stockage
            for (const imageUrl of imageUrls) {
                try {
                    // Extraction de l'URL publique de l'image à partir de la réponse JSON
                    const publicUrl = JSON.parse(imageUrl).data.publicUrl;
                    const filePath = publicUrl.split('car-images/')[1];
                    console.log('Tentative de suppression de l\'image:', filePath);

                    if (filePath) {
                        const { error: storageError } = await supabase.storage
                            .from('car-images')
                            .remove([filePath]);

                        if (storageError) {
                            console.error('Erreur lors de la suppression de l\'image:', storageError);
                        } else {
                            console.log('Image supprimée avec succès:', filePath);
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors du traitement de l\'image:', error);
                }
            }

            // 4. Mettre à jour l'interface utilisateur
            setCars(prevCars => prevCars.filter(car => car.id !== carId));
            toast.success('Annonce supprimée avec succès');

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression de l\'annonce');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes annonces</h1>

            {cars.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>Vous n'avez pas encore publié d'annonces.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Link
                            key={car.id}
                            to={`/car/${car.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative h-48">
                                <img
                                    src={car.images[0] ? car.images[0] : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80'}
                                    alt={car.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{car.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Calendar className="h-5 w-5" />
                                        <span>{car.year}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Gauge className="h-5 w-5" />
                                        <span>{car.mileage.toLocaleString()} km</span>
                                    </div>
                                </div>
                                {car.phoneNumber && (
                                    <div className="text-gray-600 mb-4">
                                        <p className="flex items-center gap-2">
                                            <Phone className="h-5 w-5" />
                                            {car.phoneNumber}
                                        </p>
                                    </div>
                                )}
                                {car.email && (
                                    <div className="text-gray-600 mb-4">
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-5 w-5" /> 
                                            {car.email}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {car.price.toLocaleString()} €
                                    </span>
                                    <button
                                        onClick={() => handleDelete(car.id, car.images)}
                                        className="text-red-600 hover:text-red-700 transition"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}