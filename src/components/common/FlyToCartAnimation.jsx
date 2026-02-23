import React from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag } from 'lucide-react';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';

/**
 * Fly-to-cart animation component.
 * Renders a portal with an absolutely-positioned element that flies
 * from the source position to the cart icon position.
 */
const FlyToCartAnimation = () => {
    const { flyAnimation } = useShoppingCart();

    if (!flyAnimation) return null;

    const { sourceRect, label, id } = flyAnimation;

    // Target: cart icon position (top-right for desktop, bottom-center for mobile)
    // We'll animate to a fixed position near the cart area
    const isMobile = window.innerWidth < 768;
    const targetX = isMobile ? window.innerWidth / 2 : window.innerWidth - 120;
    const targetY = isMobile ? window.innerHeight - 40 : 32;

    const startX = sourceRect.x + sourceRect.width / 2;
    const startY = sourceRect.y + sourceRect.height / 2;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    return createPortal(
        <div
            key={id}
            className="fixed pointer-events-none z-[9999]"
            style={{
                left: startX,
                top: startY,
                animation: 'flyToCart 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                '--fly-dx': `${deltaX}px`,
                '--fly-dy': `${deltaY}px`,
            }}
        >
            <div className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-primary/30 whitespace-nowrap">
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="max-w-[120px] truncate">{label || 'Đã thêm'}</span>
            </div>

            <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          40% {
            transform: translate(
              calc(-50% + var(--fly-dx) * 0.3),
              calc(-50% + var(--fly-dy) * 0.3 - 40px)
            ) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + var(--fly-dx)),
              calc(-50% + var(--fly-dy))
            ) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
        </div>,
        document.body
    );
};

export default FlyToCartAnimation;
