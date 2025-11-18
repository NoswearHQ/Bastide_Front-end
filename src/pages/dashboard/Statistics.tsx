import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3, ShoppingCart, MousePointerClick, Download, Calendar } from "lucide-react";
import { MedicalButton } from "@/components/ui/medical-button";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";

async function fetchStats(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const url = `/api/statistics/stats?${params.toString()}`;
  try {
    return await fetchWithAuth(url);
  } catch (error) {
    console.error('Statistics fetch failed:', error);
    throw error;
  }
}

async function fetchOrders(page = 1, limit = 50, startDate?: string, endDate?: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  try {
    return await fetchWithAuth(`/api/statistics/orders?${params.toString()}`);
  } catch (error) {
    console.error('Orders fetch failed:', error);
    throw error;
  }
}

function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    toast.error("Aucune donnée à exporter");
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      return typeof val === "string" && val.includes(",") ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Export CSV réussi");
}

export default function Statistics() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 50;

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ["statistics", startDate, endDate],
    queryFn: () => fetchStats(startDate || undefined, endDate || undefined),
    retry: 1,
  });

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["orders", ordersPage, startDate, endDate],
    queryFn: () => fetchOrders(ordersPage, ordersPerPage, startDate || undefined, endDate || undefined),
  });

  const handleExportOrders = () => {
    if (!ordersData?.rows) return;
    exportToCSV(ordersData.rows, `commandes_${new Date().toISOString().split("T")[0]}.csv`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-medical-primary" />
            Statistiques Bastide
          </h1>
        </div>

        {/* Date Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtres par date</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              />
            </div>
            <div className="flex items-end">
              <MedicalButton
                variant="outline"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Réinitialiser
              </MedicalButton>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {statsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Clicks */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MousePointerClick className="h-5 w-5 text-medical-primary" />
                    Clics sur les services
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.service_clicks?.total || 0}
                  </div>
                  <div className="space-y-2">
                    {stats.service_clicks?.by_service?.map((item: any) => (
                      <div key={item.service_name} className="flex justify-between items-center">
                        <span className="text-gray-600">{item.service_name}</span>
                        <span className="font-semibold text-gray-900">{item.count}</span>
                      </div>
                    )) || <p className="text-gray-500 text-sm">Aucun clic enregistré</p>}
                  </div>
                </div>
              </div>

              {/* Product Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-medical-primary" />
                    Commandes produits
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.product_orders?.total || 0}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Par type de commande:</p>
                      {stats.product_orders?.by_type?.map((item: any) => (
                        <div key={item.order_type} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize">{item.order_type}</span>
                          <span className="font-semibold text-gray-900">{item.count}</span>
                        </div>
                      )) || <p className="text-gray-500 text-sm">Aucune commande</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            {stats.product_orders?.by_product && stats.product_orders.by_product.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Produits les plus commandés
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-semibold text-gray-700">Produit</th>
                        <th className="text-right py-2 px-4 font-semibold text-gray-700">Nombre de commandes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.product_orders.by_product.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 px-4 text-gray-600">{item.product_title || "N/A"}</td>
                          <td className="py-2 px-4 text-right font-semibold text-gray-900">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Détail des commandes</h3>
                <MedicalButton variant="outline" onClick={handleExportOrders}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </MedicalButton>
              </div>
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-medical-primary mx-auto"></div>
                </div>
              ) : ordersData?.rows && ordersData.rows.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-2 px-4 font-semibold text-gray-700">Produit</th>
                          <th className="text-left py-2 px-4 font-semibold text-gray-700">Référence</th>
                          <th className="text-left py-2 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-2 px-4 font-semibold text-gray-700">Téléphone</th>
                          <th className="text-left py-2 px-4 font-semibold text-gray-700">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersData.rows.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4 text-gray-600">{order.created_at}</td>
                            <td className="py-2 px-4 text-gray-900">{order.product_title}</td>
                            <td className="py-2 px-4 text-gray-600">{order.product_reference || "—"}</td>
                            <td className="py-2 px-4 text-gray-600">{order.customer_email || "—"}</td>
                            <td className="py-2 px-4 text-gray-600">{order.customer_phone}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                order.order_type === "mail" 
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {order.order_type === "mail" ? "Email" : "WhatsApp"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {ordersData.total > ordersPerPage && (
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Page {ordersPage} sur {Math.ceil(ordersData.total / ordersPerPage)}
                      </p>
                      <div className="flex gap-2">
                        <MedicalButton
                          variant="outline"
                          size="sm"
                          onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                          disabled={ordersPage === 1}
                        >
                          Précédent
                        </MedicalButton>
                        <MedicalButton
                          variant="outline"
                          size="sm"
                          onClick={() => setOrdersPage(p => p + 1)}
                          disabled={ordersPage >= Math.ceil(ordersData.total / ordersPerPage)}
                        >
                          Suivant
                        </MedicalButton>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center py-8 text-gray-500">Aucune commande trouvée</p>
              )}
            </div>
          </>
        ) : statsError ? (
          <div className="text-center py-12">
            <div className="text-red-600 font-semibold mb-2">Erreur lors du chargement des statistiques</div>
            <div className="text-sm text-gray-500 mb-4">{statsError.message}</div>
            <MedicalButton variant="outline" onClick={() => refetchStats()}>
              Réessayer
            </MedicalButton>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Erreur lors du chargement des statistiques
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

