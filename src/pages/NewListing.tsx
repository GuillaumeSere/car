import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function NewListing() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        year: new Date().getFullYear(),
        mileage: '',
        images: [] as (File | string)[], // Modification pour stocker les URL des images
    });

    const uploadImage = async (file: File, path: string) => {
        try {
            if (!user) throw new Error('Utilisateur non connecté');
    
            const { data, error } = await supabase.storage
                .from('car-images')
                .upload(`${user.id}/${path}`, file, {
                    cacheControl: '3600',
                    upsert: false
                });
    
            if (error) throw error;
            
            // Vérification que le fichier a bien été stocké
            if (!data) throw new Error("L'image n'a pas été stockée correctement");
    
            // Récupérer l'URL publique
            const { data: publicUrlData } = supabase
                .storage
                .from('car-images')
                .getPublicUrl(`${user.id}/${path}`);
    
            return publicUrlData.publicUrl;
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            throw error;
        }
    };

    const validateImage = (file: File) => {
        const maxSize = 2 * 1024 * 2024; // 2MB
        if (file.size > maxSize) {
            throw new Error('Image trop grande (max 2MB)');
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Format non supporté (JPG ou PNG uniquement)');
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const imageUrls = [];

            // Upload images if any
            if (formData.images.length > 0) {
                for (const image of formData.images) {
                    if (typeof image === 'string') {
                        // Si l'image est déjà une URL, on l'ajoute directement
                        imageUrls.push(image);
                    } else {
                        const fileExt = image.name.split('.').pop();
                        const fileName = `${Math.random()}.${fileExt}`;
                        const filePath = `${fileName}`;

                        validateImage(image);

                        const publicUrl = await uploadImage(image, filePath);
                        imageUrls.push(publicUrl);
                    }
                }
            }

            // Création de l'annonce de voiture
            const { error } = await supabase.from('cars').insert({
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                year: formData.year,
                mileage: parseInt(formData.mileage),
                images: imageUrls, // Modification pour envoyer les URL des images
                user_id: user.id,
            });

            if (error) throw error;

            navigate('/my-listings');
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []).slice(0, 3);
        
        if (files.length + formData.images.length > 3) {
            setError('Vous ne pouvez télécharger que 3 images maximum');
            return;
        }
    
        setFormData(prevState => ({
            ...prevState,
            images: [...prevState.images, ...files], // Ajout des nouvelles images
        }));
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Poster une annonce</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Titre de l'annonce
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Prix (€)
                        </label>
                        <input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                            Année
                        </label>
                        <input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                            Kilométrage
                        </label>
                        <input
                            id="mileage"
                            type="number"
                            value={formData.mileage}
                            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>
                
                    <div>
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                            Images (3 maximum)
                        </label>
                        <input
                            id="images"
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex space-x-4">
                        {formData.images.map((file, index) => (
                            <img key={index} src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt="Preview" className="w-32 h-32 object-cover" />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
                    </button>
                </form>
        </div>
    );
}