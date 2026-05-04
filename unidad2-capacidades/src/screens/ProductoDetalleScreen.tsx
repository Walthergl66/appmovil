import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../theme';
import type { Producto } from '../types';

type Props = {
  producto: Producto;
  onVolver: () => void;
};

export function ProductoDetalleScreen({ producto, onVolver }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.marcaRow}>
          <Image source={require('../../assets/nexologo.jpeg')} style={styles.logoMini} />
          <View>
            <Text style={styles.titulo}>Detalle</Text>
            <Text style={styles.subtitulo}>Producto publicado</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.botonChip, styles.botonVolver]} onPress={onVolver}>
          <Text style={styles.textoChip}>Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: producto.fotoUri }} style={styles.foto} />

        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.precio}>$ {producto.precio}</Text>

        <Text style={styles.label}>Descripción</Text>
        <Text style={styles.descripcion}>
          {producto.descripcion?.trim() ? producto.descripcion : 'Sin descripción'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  marcaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMini: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  subtitulo: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.muted,
  },
  botonChip: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  botonVolver: {
    backgroundColor: '#EAF6EE',
    borderColor: '#CFE9D7',
  },
  textoChip: {
    color: COLORS.brandDark,
    fontWeight: '900',
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  foto: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    backgroundColor: '#F7FAF8',
    marginBottom: 14,
  },
  nombre: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  precio: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.brandDark,
  },
  label: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.muted,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  descripcion: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
  },
});

