import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatPrice } from "@/lib/domain";

interface PaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  price: number;
}

export function PaymentDrawer({ isOpen, onClose, domain, price }: PaymentDrawerProps) {
  const discountedPrice = Math.floor(price * 0.9); // 10% discount

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl">Select Payment Option</DrawerTitle>
          <DrawerDescription>
            Domain: {domain}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">Direct Payment - Save 10%!</h3>
            <p className="text-sm text-muted-foreground">
              Pay directly via PayPal or credit card and get a 10% discount
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                ${formatPrice(discountedPrice)}
              </span>
              <Button
                onClick={() => window.location.href = 'https://www.paypal.com/ncp/payment/VS24ZV4ABUC8Y'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Pay Now
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">Standard Payment</h3>
            <p className="text-sm text-muted-foreground">
              Continue to payment through Sedo
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                ${formatPrice(price)}
              </span>
              <Button
                variant="outline"
                onClick={() => window.location.href = `https://sedo.com/search/?keyword=${domain}`}
              >
                Continue to Sedo
              </Button>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}