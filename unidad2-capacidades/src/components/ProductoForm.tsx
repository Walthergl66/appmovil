import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { COLORS } from '../theme';
import type { Producto } from '../types';

type Props = {
  onGuardar: (producto: Producto) => void;
  onCancelar: () => void;
};

export function ProductoForm({ onGuardar, onCancelar }: Props) {
  const [imagen, setImagen] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Debe permitir el acceso a la galería para seleccionar una imagen.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Debe permitir el acceso a la cámara para tomar una foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const guardar = () => {
    if (!imagen) {
      Alert.alert('Advertencia', 'Debe tomar o seleccionar la foto del producto.');
      return;
    }
    if (nombre.trim() === '') {
      Alert.alert('Advertencia', 'Debe escribir el nombre del producto.');
      return;
    }
    if (precio.trim() === '') {
      Alert.alert('Advertencia', 'Debe escribir el precio.');
      return;
    }

    const creadoEn = Date.now();
    onGuardar({
      id: `${creadoEn}`,
      nombre: nombre.trim(),
      precio: precio.trim(),
      descripcion: descripcion.trim(),
      fotoUri: imagen,
      creadoEn,
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.seccionTitulo}>
        <Text style={styles.cardTitulo}>Publicar producto</Text>
        <Text style={styles.cardAyuda}>Toma una foto y completa los datos.</Text>
      </View>

      <Text style={styles.label}>Foto</Text>

      {imagen ? (
        <Image source={{ uri: imagen }} style={styles.imagen} />
      ) : (
        <View style={styles.contenedorVacio}>
          <Text style={styles.textoVacio}>Aún no hay foto</Text>
        </View>
      )}

      <View style={styles.row}>
        <TouchableOpacity style={[styles.boton, styles.botonPrimario]} onPress={tomarFoto}>
          <Text style={styles.textoBoton}>Tomar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonSecundario]} onPress={seleccionarImagen}>
          <Text style={styles.textoBotonSecundario}>Galería</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Taza personalizada"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 25.000"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        placeholderTextColor={COLORS.muted}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Detalles, materiales, talla, etc."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholderTextColor={COLORS.muted}
      />

      <TouchableOpacity style={[styles.boton, styles.botonGuardar]} onPress={guardar}>
        <Text style={styles.textoBoton}>Guardar producto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.boton, styles.botonLimpiar]} onPress={onCancelar}>
        <Text style={styles.textoBotonLimpiar}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  seccionTitulo: {
    marginBottom: 12,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardAyuda: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  imagen: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  contenedorVacio: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F7FBF8',
  },
  textoVacio: {
    color: COLORS.muted,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  boton: {
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPrimario: {
    flex: 1,
    backgroundColor: COLORS.brand,
    shadowColor: COLORS.brandDark,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  botonSecundario: {
    width: 110,
    backgroundColor: '#EAF6EE',
    borderWidth: 1,
    borderColor: '#CFE9D7',
  },
  botonGuardar: {
    backgroundColor: COLORS.brandDark,
    marginTop: 16,
  },
  botonLimpiar: {
    backgroundColor: '#F2F5F3',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 10,
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
  textoBotonLimpiar: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  inputMultiline: {
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
    color: COLORS.text,
  },
});

