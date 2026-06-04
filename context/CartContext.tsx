// Re-export canonical cart context from its source component.
// Import from here in all new files to keep imports decoupled from the UI layer.
export {
  CartProvider,
  useCart,
  type CartItem,
} from "@/components/MiniCart"
