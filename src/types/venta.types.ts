import type { Producto } from './producto.types'

export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'

export interface ItemVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface PagoRequest {
  metodoPago: MetodoPago;
  monto: number;
}

export interface RegistrarVentaRequest {
  nombreCliente: string;
  cedulaCliente: string;
  items: ItemVentaRequest[];
  pagos: PagoRequest[];
}

export interface DetalleVentaResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

export interface PagoResponse {
  id: number;
  metodoPago: string;
  monto: number;
}

export interface ReembolsoResponse {
  id: number;
  ventaId: number;
  motivo: string;
  fecha: string;
  usuarioId: number;
  nombreUsuario: string;
}

export interface VentaResponse {
  id: number;
  numeroFactura: string;
  usuarioId: number;
  nombreCajero: string;
  nombreCliente: string;
  cedulaCliente: string;
  detalles: DetalleVentaResponse[];
  pagos: PagoResponse[];
  subtotal: number;
  tasaImpuesto: number;
  impuesto: number;
  total: number;
  fecha: string;
  reembolsada: boolean;
  reembolso: ReembolsoResponse | null;
}

export interface ReembolsoRequest {
  motivo: string;
}

export interface FiltrosVenta {
  fecha?: string;
  cedulaCliente?: string;
  metodoPago?: MetodoPago;
  page?: number;
  size?: number;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}
