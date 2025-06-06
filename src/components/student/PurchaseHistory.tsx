
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PurchaseRecord = {
  id: string;
  course_title: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  is_free: boolean;
};

export default function PurchaseHistory() {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!userDetails?.id) return;

      try {
        const { data, error } = await supabase
          .from('course_purchases')
          .select(`
            id,
            amount,
            payment_method,
            status,
            created_at,
            course:courses(
              title,
              is_free
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar histórico de compras:', error);
          throw error;
        }

        const formattedPurchases = data
          .filter(item => item.course)
          .map((item: any) => ({
            id: item.id,
            course_title: item.course.title,
            amount: item.amount,
            payment_method: item.payment_method,
            status: item.status,
            created_at: item.created_at,
            is_free: item.course.is_free
          }));

        setPurchases(formattedPurchases);
      } catch (error) {
        console.error('Erro ao carregar histórico de compras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [userDetails]);

  const formatPrice = (amount: number, isFree: boolean) => {
    if (isFree) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'free': return 'Gratuito';
      case 'card': return 'Cartão';
      case 'pix': return 'PIX';
      default: return method;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Dashboard</span>
        </Button>
        <h1 className="text-2xl font-bold">Histórico de Compras</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Minhas Compras ({purchases.length})</span>
            {purchases.length > 0 && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Você ainda não realizou nenhuma compra.</p>
              <Button onClick={() => navigate('/student/courses')}>
                Explorar Cursos
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">
                      {purchase.course_title}
                    </TableCell>
                    <TableCell>
                      {formatPrice(purchase.amount, purchase.is_free)}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodLabel(purchase.payment_method)}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusColor(purchase.status)}>
                        {getStatusLabel(purchase.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(purchase.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
