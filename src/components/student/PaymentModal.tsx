
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Check, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'card' | 'pix';
type PaymentStep = 'method' | 'details' | 'processing' | 'success' | 'error';

type Course = {
  id: string;
  title: string;
  price: number | null;
  is_free: boolean | null;
};

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onPaymentSuccess: () => void;
};

export default function PaymentModal({ isOpen, onClose, course, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [pixCode, setPixCode] = useState('');

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCurrentStep('details');
  };

  const handlePayment = async () => {
    setCurrentStep('processing');
    
    // Simular processamento de pagamento
    setTimeout(() => {
      // Simular sucesso (90% das vezes)
      const success = Math.random() > 0.1;
      
      if (success) {
        if (paymentMethod === 'pix') {
          // Para PIX, gerar código
          setPixCode('00020126580014BR.GOV.BCB.PIX013636401b85-...');
        }
        setCurrentStep('success');
      } else {
        setCurrentStep('error');
      }
    }, 2000);
  };

  const handleSuccess = () => {
    onPaymentSuccess();
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setCurrentStep('method');
    setPaymentMethod('card');
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
    setPixCode('');
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const renderMethodSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(course.price)}
        </div>
      </div>
      
      <div className="space-y-3">
        <Card 
          className={cn(
            "cursor-pointer transition-colors border-2",
            paymentMethod === 'card' ? "border-primary" : "border-gray-200"
          )}
          onClick={() => setPaymentMethod('card')}
        >
          <CardContent className="flex items-center p-4">
            <CreditCard className="mr-3 h-5 w-5" />
            <span className="font-medium">Cartão de Crédito</span>
          </CardContent>
        </Card>
        
        <Card 
          className={cn(
            "cursor-pointer transition-colors border-2",
            paymentMethod === 'pix' ? "border-primary" : "border-gray-200"
          )}
          onClick={() => setPaymentMethod('pix')}
        >
          <CardContent className="flex items-center p-4">
            <Smartphone className="mr-3 h-5 w-5" />
            <span className="font-medium">PIX</span>
          </CardContent>
        </Card>
      </div>
      
      <Button 
        className="w-full mt-6" 
        onClick={() => handleMethodSelect(paymentMethod)}
      >
        Continuar
      </Button>
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Número do Cartão</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardData.number}
            onChange={(e) => setCardData({...cardData, number: e.target.value})}
            maxLength={19}
          />
        </div>
        
        <div>
          <Label htmlFor="cardName">Nome no Cartão</Label>
          <Input
            id="cardName"
            placeholder="João Silva"
            value={cardData.name}
            onChange={(e) => setCardData({...cardData, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Validade</Label>
            <Input
              id="expiry"
              placeholder="MM/AA"
              value={cardData.expiry}
              onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cardData.cvv}
              onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
              maxLength={4}
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total a pagar:</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(course.price)}
          </span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handlePayment}
          disabled={!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv}
        >
          Finalizar Pagamento
        </Button>
      </div>
    </div>
  );

  const renderPixForm = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('method')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
      
      <div className="text-center space-y-4">
        <div className="text-lg font-medium">Pagamento via PIX</div>
        <div className="text-2xl font-bold text-primary">
          {formatPrice(course.price)}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            Clique no botão abaixo para gerar o código PIX e finalizar o pagamento.
          </p>
        </div>
        
        <Button className="w-full" onClick={handlePayment}>
          Gerar Código PIX
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <div className="text-lg font-medium">Processando pagamento...</div>
      <div className="text-sm text-gray-600">
        {paymentMethod === 'pix' ? 'Gerando código PIX...' : 'Validando dados do cartão...'}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-green-600">Pagamento Confirmado!</h3>
        <p className="text-gray-600">
          Sua inscrição no curso <strong>{course.title}</strong> foi realizada com sucesso.
        </p>
      </div>
      
      {paymentMethod === 'pix' && pixCode && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium mb-2">Código PIX:</div>
          <div className="text-xs font-mono bg-white p-2 rounded border break-all">
            {pixCode}
          </div>
        </div>
      )}
      
      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-4">
          Você já pode acessar o curso em sua área de estudos.
        </div>
        <Button className="w-full" onClick={handleSuccess}>
          Ir para Meus Cursos
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <X className="h-8 w-8 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-red-600">Pagamento Não Autorizado</h3>
        <p className="text-gray-600">
          Houve um problema ao processar seu pagamento. Verifique os dados e tente novamente.
        </p>
      </div>
      
      <div className="space-y-2">
        <Button className="w-full" onClick={() => setCurrentStep('details')}>
          Tentar Novamente
        </Button>
        <Button variant="outline" className="w-full" onClick={handleClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'method':
        return renderMethodSelection();
      case 'details':
        return paymentMethod === 'card' ? renderCardForm() : renderPixForm();
      case 'processing':
        return renderProcessing();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
      default:
        return renderMethodSelection();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'method' && 'Escolha a forma de pagamento'}
            {currentStep === 'details' && `Pagamento via ${paymentMethod === 'card' ? 'Cartão' : 'PIX'}`}
            {currentStep === 'processing' && 'Processando...'}
            {currentStep === 'success' && 'Pagamento Realizado'}
            {currentStep === 'error' && 'Erro no Pagamento'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
