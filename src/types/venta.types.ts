import type { Producto } from './producto.types'

export interface ItemVenta {
  productoId: number;
  cantidad: number;
}

export interface RegistrarVentaRequest {
  items: ItemVenta[];
}

export interface VentaResponse {
  id: number;
  total: number;
  fecha: string;
  detalles: DetalleVentaResponse[];
}

export interface DetalleVentaResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Carrito (estado local, no viene del backend)
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}