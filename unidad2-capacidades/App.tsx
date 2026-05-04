import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProductoForm } from './src/components/ProductoForm';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductosScreen } from './src/screens/ProductosScreen';
import { COLORS } from './src/theme';
import type { Producto } from './src/types';

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pantalla, setPantalla] = useState<'home' | 'productos' | 'publicar'>('home');

  const guardarProducto = (producto: Producto) => {
    setProductos((prev) => [producto, ...prev]);
    setPantalla('productos');
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
          />
        ) : null}

        {pantalla === 'publicar' ? (
          <ProductoForm onGuardar={guardarProducto} onCancelar={() => setPantalla('home')} />
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