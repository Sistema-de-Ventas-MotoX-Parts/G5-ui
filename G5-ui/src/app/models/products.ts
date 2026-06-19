export interface Product {
  id?: number;
  codigoSku: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: {
    id?: number;
    nombre?: string;
  };
  activo: boolean;
}