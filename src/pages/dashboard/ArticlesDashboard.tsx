import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Articles() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Gérer les Articles</h1>
      <p className="text-gray-600">Ici, vous pourrez créer, modifier, supprimer et afficher vos articles.</p>
    </DashboardLayout>
  );
}
