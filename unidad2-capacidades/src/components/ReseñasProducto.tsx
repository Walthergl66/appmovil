import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { COLORS } from '../theme';
import type { Resena } from '../types';

type Props = {
  resenas: Resena[];
  onGuardar: (resena: Resena) => void;
  onEliminar: (id: string) => void;
};

const formatearFecha = (fecha: number) => {
  const d = new Date(fecha);
  const dia = `${d.getDate()}`.padStart(2, '0');
  const mes = `${d.getMonth() + 1}`.padStart(2, '0');
  const anio = d.getFullYear();
  const hora = `${d.getHours()}`.padStart(2, '0');
  const minutos = `${d.getMinutes()}`.padStart(2, '0');

  return `${dia}/${mes}/${anio} - ${hora}:${minutos}`;
};

export function ResenasProducto({ resenas, onGuardar, onEliminar }: Props) {
  const [evidencia, setEvidencia] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Debe permitir el acceso a la galería para subir evidencia.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setEvidencia(resultado.assets[0].uri);
    }
  };

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Debe permitir el acceso a la cámara para tomar evidencia.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setEvidencia(resultado.assets[0].uri);
    }
  };

  const guardar = () => {
    if (!evidencia) {
      Alert.alert('Advertencia', 'Debe tomar o seleccionar una imagen de evidencia.');
      return;
    }

    if (descripcion.trim() === '') {
      Alert.alert('Advertencia', 'Debe escribir una descripción de la reseña.');
      return;
    }

    const creadoEn = Date.now();
    onGuardar({
      id: `${creadoEn}`,
      descripcion: descripcion.trim(),
      evidenciaUri: evidencia,
      creadoEn,
    });

    setEvidencia(null);
    setDescripcion('');
  };

  const confirmarEliminacion = (id: string) => {
    Alert.alert('Eliminar reseña', '¿Seguro que desea eliminar esta reseña?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onEliminar(id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.seccionTitulo}>
        <Text style={styles.cardTitulo}>Reseñas del producto</Text>
        <Text style={styles.cardAyuda}>Agrega una imagen como evidencia y cuenta tu experiencia.</Text>
      </View>

      <Text style={styles.label}>Evidencia</Text>
      {evidencia ? (
        <Image source={{ uri: evidencia }} style={styles.imagen} />
      ) : (
        <View style={styles.contenedorVacio}>
          <Text style={styles.textoVacio}>Sin evidencia seleccionada</Text>
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

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Ej: Me gustó mucho el producto o me llegó defectuoso."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        placeholderTextColor={COLORS.muted}
      />

      <TouchableOpacity style={[styles.boton, styles.botonGuardar]} onPress={guardar}>
        <Text style={styles.textoBoton}>Guardar reseña</Text>
      </TouchableOpacity>

      <View style={styles.divisor} />

      <Text style={styles.listaTitulo}>Reseñas registradas: {resenas.length}</Text>

      {resenas.length === 0 ? (
        <View style={styles.estadoVacio}>
          <Text style={styles.textoEstadoVacio}>Aún no hay reseñas para este producto.</Text>
        </View>
      ) : (
        resenas.map((resena, index) => (
          <View key={resena.id} style={styles.item}>
            <Image source={{ uri: resena.evidenciaUri }} style={styles.itemImagen} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemDescripcion}>
                {index + 1}. {resena.descripcion}
              </Text>
              <Text style={styles.itemFecha}>{formatearFecha(resena.creadoEn)}</Text>
              <TouchableOpacity onPress={() => confirmarEliminacion(resena.id)}>
                <Text style={styles.eliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 14,
  },
  seccionTitulo: {
    marginBottom: 8,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  cardAyuda: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.muted,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.muted,
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  imagen: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  contenedorVacio: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
  divisor: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },
  listaTitulo: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 10,
  },
  estadoVacio: {
    backgroundColor: '#F7FAF8',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textoEstadoVacio: {
    color: COLORS.muted,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemImagen: {
    width: 78,
    height: 78,
    borderRadius: 12,
    backgroundColor: '#F7FAF8',
  },
  itemInfo: {
    flex: 1,
  },
  itemDescripcion: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  itemFecha: {
    marginTop: 5,
    color: COLORS.muted,
    fontSize: 12,
  },
  eliminar: {
    marginTop: 6,
    color: COLORS.danger,
    fontWeight: '900',
  },
});
