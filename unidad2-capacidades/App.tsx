import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProductoForm } from './src/components/ProductoForm';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductoDetalleScreen } from './src/screens/ProductoDetalleScreen';
import { ProductosScreen } from './src/screens/ProductosScreen';
import { COLORS } from './src/theme';
import type { Producto, Resena } from './src/types';

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [resenasPorProducto, setResenasPorProducto] = useState<Record<string, Resena[]>>({});
  const [pantalla, setPantalla] = useState<'home' | 'productos' | 'publicar' | 'detalle'>('home');
  const [productoActivo, setProductoActivo] = useState<Producto | null>(null);

  const guardarProducto = (producto: Producto) => {
    setProductos((prev) => [producto, ...prev]);
    setProductoActivo(producto);
    setPantalla('detalle');
  };

  const guardarResena = (productoId: string, resena: Resena) => {
    setResenasPorProducto((prev) => ({
      ...prev,
      [productoId]: [resena, ...(prev[productoId] ?? [])],
    }));
  };

  const eliminarResena = (productoId: string, resenaId: string) => {
    setResenasPorProducto((prev) => ({
      ...prev,
      [productoId]: (prev[productoId] ?? []).filter((r) => r.id !== resenaId),
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {pantalla === 'home' ? (
          <HomeScreen
            productosCount={productos.length}
            onPublicar={() => setPantalla('publicar')}
            onIrProductos={() => setPantalla('productos')}
          />
        ) : null}

        {pantalla === 'productos' ? (
          <ProductosScreen
            productos={productos}
            onVolver={() => setPantalla('home')}
            onPublicar={() => setPantalla('publicar')}
            onVerDetalle={(p) => {
              setProductoActivo(p);
              setPantalla('detalle');
            }}
          />
        ) : null}

        {pantalla === 'publicar' ? (
          <ProductoForm onGuardar={guardarProducto} onCancelar={() => setPantalla('home')} />
        ) : null}

        {pantalla === 'detalle' && productoActivo ? (
          <ProductoDetalleScreen
            producto={productoActivo}
            resenas={resenasPorProducto[productoActivo.id] ?? []}
            onVolver={() => setPantalla('productos')}
            onGuardarResena={(resena) => guardarResena(productoActivo.id, resena)}
            onEliminarResena={(resenaId) => eliminarResena(productoActivo.id, resenaId)}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },
  content: {
    flexGrow: 1,
  },
});
