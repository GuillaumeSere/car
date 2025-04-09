import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Unsubscribe() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleUnsubscribe = async () => {
        if (!user) return;

        try {
            setIsDeleting(true);

            // 1. Récupérer toutes les annonces de l'utilisateur
            const { data: userCars, error: carsError } = await supabase
                .from('cars')
                .select('*')
                .eq('user_id', user.id);

            if (carsError) throw carsError;

            // Modification pour appeler la fonction de suppression d'utilisateur via fetch avec ajout de l'en-tête d'authentification
            const response = await fetch('https://nlzbgmoxddfvzmvjntgi.supabase.co/functions/v1/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
                },
                body: JSON.stringify({ user_id: user.id }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'utilisateur');
            }

            // 2. Supprimer toutes les images des annonces
            for (const car of userCars || []) {
                for (const imageUrl of car.images) {
                    try {
                        const publicUrl = JSON.parse(imageUrl).data.publicUrl;
                        const filePath = publicUrl.split('car-images/')[1];
                        
                        if (filePath) {
                            await supabase.storage
                                .from('car-images')
                                .remove([filePath]);
                        }
                    } catch (error) {
                        console.error('Erreur lors de la suppression de l\'image:', error);
                    }
                }
            }

            // 3. Supprimer toutes les annonces
            const { error: deleteError } = await supabase
                .from('cars')
                .delete()
                .eq('user_id', user.id);

            if (deleteError) throw deleteError;

            // 4. Supprimer le compte utilisateur
            const { error: userDeleteError } = await supabase.auth.admin.deleteUser(user.id);

            if (userDeleteError) throw userDeleteError;

            // 5. Déconnexion
            await supabase.auth.signOut();
            
            toast.success('Votre compte a été supprimé avec succès');
            navigate('/');

        } catch (error) {
            console.error('Erreur lors de la désinscription:', error);
            toast.error('Une erreur est survenue lors de la suppression du compte');
        } finally {
            setIsDeleting(false);
            setShowConfirmDialog(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Supprimer mon compte</h2>
            
            {!showConfirmDialog ? (
                <div>
                    <p className="text-gray-600 mb-6">
                        Attention : La suppression de votre compte est une action irréversible. 
                        Toutes vos annonces et données seront définitivement supprimées.
                    </p>
                    <button
                        onClick={() => setShowConfirmDialog(true)}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Supprimer mon compte
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">
                            Êtes-vous vraiment sûr de vouloir supprimer votre compte ?
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={handleUnsubscribe}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Suppression en cours...' : 'Confirmer la suppression'}
                        </button>
                        
                        <button
                            onClick={() => setShowConfirmDialog(false)}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}