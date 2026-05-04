import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../theme';

type Props = {
  productosCount: number;
  onIrProductos: () => void;
  onPublicar: () => void;
};

export function HomeScreen({ productosCount, onIrProductos, onPublicar }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Image
            source={require('../../assets/nexologo.jpeg')}
            style={styles.logo}
            accessibilityLabel="Logo Nexologo"
          />
        </View>
        <Text style={styles.titulo}>NexoCatálogo</Text>
        <Text style={styles.subtitulo}>Tu mini tienda: publica y organiza tus productos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Panel</Text>
        <Text style={styles.cardAyuda}>
          Productos publicados: <Text style={styles.numero}>{productosCount}</Text>
        </Text>

        <TouchableOpacity style={[styles.boton, styles.botonPrimario]} onPress={onPublicar}>
          <Text style={styles.textoBoton}>Publicar nuevo producto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonSecundario]} onPress={onIrProductos}>
          <Text style={styles.textoBotonSecundario}>Ir a mis productos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 12,
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  logo: {
    width: 82,
    height: 82,
    borderRadius: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitulo: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.muted,
    marginBottom: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardAyuda: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 14,
  },
  numero: {
    color: COLORS.brandDark,
    fontWeight: '900',
  },
  boton: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPrimario: {
    backgroundColor: COLORS.brandDark,
    shadowColor: COLORS.brandDark,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  botonSecundario: {
    marginTop: 10,
    backgroundColor: '#EAF6EE',
    borderWidth: 1,
    borderColor: '#CFE9D7',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoBotonSecundario: {
    color: COLORS.brandDark,
    fontSize: 15,
    fontWeight: '800',
  },
});

