import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../theme';
import type { Producto } from '../types';

type Props = {
  productos: Producto[];
};

export function ProductosList({ productos }: Props) {
  if (productos.length === 0) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.textoListaVacia}>Aún no has agregado productos.</Text>
        <Text style={styles.textoListaVaciaAyuda}>Empieza publicando tu primer producto.</Text>
      </View>
    );
  }

  return (
    <View>
      {productos.map((p) => (
        <View key={p.id} style={styles.item}>
          <Image source={{ uri: p.fotoUri }} style={styles.itemImagen} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemNombre}>{p.nombre}</Text>
            <Text style={styles.itemPrecio}>$ {p.precio}</Text>
            {!!p.descripcion && (
              <Text style={styles.itemDescripcion} numberOfLines={3}>
                {p.descripcion}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  vacio: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textoListaVacia: {
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  textoListaVaciaAyuda: {
    marginTop: 6,
    color: COLORS.muted,
    textAlign: 'center',
  },
  item: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImagen: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  itemPrecio: {
    marginTop: 2,
    fontSize: 15,
    color: COLORS.brandDark,
    fontWeight: 'bold',
  },
  itemDescripcion: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13,
  },
});

