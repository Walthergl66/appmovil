import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../theme';
import type { Producto } from '../types';
import { ProductosList } from '../components/ProductosList';

type Props = {
  productos: Producto[];
  onVolver: () => void;
  onPublicar: () => void;
};

export function ProductosScreen({ productos, onVolver, onPublicar }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.marcaRow}>
          <Image source={require('../../assets/nexologo.jpeg')} style={styles.logoMini} />
          <View>
            <Text style={styles.titulo}>Mis productos</Text>
            <Text style={styles.subtitulo}>Total: {productos.length}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.botonChip, styles.botonVolver]} onPress={onVolver}>
          <Text style={styles.textoChip}>Volver</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.boton, styles.botonPrimario]} onPress={onPublicar}>
        <Text style={styles.textoBoton}>Publicar nuevo producto</Text>
      </TouchableOpacity>

      <ProductosList productos={productos} />
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
  boton: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  botonPrimario: {
    backgroundColor: COLORS.brandDark,
    shadowColor: COLORS.brandDark,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

