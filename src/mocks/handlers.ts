import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:8080'

// Datos mock de productos
const productos = [
  { id: 1, nombre: 'Café', descripcion: 'Café negro', precio: 10, stock: 50, activo: true },
  { id: 2, nombre: 'Té', descripcion: 'Té verde', precio: 8, stock: 30, activo: true },
  { id: 3, nombre: 'Croissant', descripcion: 'Croissant de mantequilla', precio: 5, stock: 20, activo: true },
  { id: 4, nombre: 'Sandwich', descripcion: 'Sandwich de jamón y queso', precio: 12, stock: 0, activo: true },
]

export const handlers = [
  // Login
  http.post(`${API_URL}/api/auth/login`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string }
    console.log('🔐 Login:', body)
    if (body.username === 'admin' && body.password === 'admin') {
      return HttpResponse.json({
        token: 'fake-jwt-token-123',
        username: 'admin',
        nombre: 'Administrador',
      })
    }
    return HttpResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    )
  }),

  // Listar productos
  http.get(`${API_URL}/api/productos`, () => {
    console.log('📦 GET /api/productos')
    return HttpResponse.json(productos)
  }),

  // Crear producto
  http.post(`${API_URL}/api/productos`, async ({ request }) => {
    const body = await request.json() as any
    console.log('➕ Crear producto:', body)
    const nuevo = {
      id: Date.now(),
      nombre: body.nombre,
      descripcion: body.descripcion || '',
      precio: body.precio,
      stock: body.stock,
      activo: true,
    }
    productos.push(nuevo)
    return HttpResponse.json(nuevo, { status: 201 })
  }),

  // Actualizar producto
  http.put(`${API_URL}/api/productos/:id`, async ({ params, request }) => {
    const body = await request.json() as any
    const index = productos.findIndex(p => p.id === Number(params.id))
    if (index !== -1) {
      productos[index] = {
        ...productos[index],
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        precio: body.precio,
        stock: body.stock,
      }
      return HttpResponse.json(productos[index])
    }
    return HttpResponse.json({ message: 'No encontrado' }, { status: 404 })
  }),

  // Eliminar producto
  http.delete(`${API_URL}/api/productos/:id`, ({ params }) => {
    const index = productos.findIndex(p => p.id === Number(params.id))
    if (index !== -1) productos.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Registrar venta
  http.post(`${API_URL}/api/ventas`, async ({ request }) => {
    const body = await request.json() as any
    console.log('🛒 POST /api/ventas:', body)
    
    let total = 0
    const detalles = body.items.map((item: any) => {
      const producto = productos.find(p => p.id === item.productoId)
      const precio = producto ? producto.precio : 10
      const subtotal = precio * item.cantidad
      total += subtotal
      return {
        productoId: item.productoId,
        nombreProducto: producto?.nombre || 'Producto',
        cantidad: item.cantidad,
        precioUnitario: precio,
        subtotal,
      }
    })

    const venta = {
      id: Date.now(),
      total,
      fecha: new Date().toISOString(),
      detalles,
    }

    console.log('✅ Venta registrada:', venta)
    return HttpResponse.json(venta, { status: 201 })
  }),

  // Listar ventas
  http.get(`${API_URL}/api/ventas`, () => {
    return HttpResponse.json([])
  }),
]