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
  const [mostrarAdjuntos, setMostrarAdjuntos] = useState(false);
  const [estadoDispositivo, setEstadoDispositivo] = useState('Pendiente de validación');
  const [modoImagen, setModoImagen] = useState('Sin imagen');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const validarDispositivo = async (origen: 'camara' | 'galeria') => {
    const solicitarPermiso =
      origen === 'camara'
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;
    const permiso = await solicitarPermiso();

    if (!permiso.granted) {
      setEstadoDispositivo(origen === 'camara' ? 'Cámara sin permiso' : 'Galería sin permiso');
      Alert.alert(
        'Permiso requerido',
        origen === 'camara'
          ? 'Debe permitir el acceso a la cámara para fotografiar el producto.'
          : 'Debe permitir el acceso a la galería para seleccionar la foto del producto.'
      );
      return false;
    }

    setEstadoDispositivo(origen === 'camara' ? 'Cámara validada' : 'Galería validada');
    return true;
  };

  const cargarImagen = async (origen: 'camara' | 'galeria', recortar: boolean) => {
    const abrirSelector =
      origen === 'camara' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

    const resultado = await abrirSelector({
      mediaTypes: ['images'],
      allowsEditing: recortar,
      aspect: [4, 3],
      quality: 1,
    });

    if (resultado.canceled) {
      setEstadoDispositivo('Carga cancelada');
      return;
    }

    setImagen(resultado.assets[0].uri);
    setModoImagen(recortar ? 'Imagen recortada' : 'Imagen original');
    setMostrarAdjuntos(false);
  };

  const elegirModoImagen = async (origen: 'camara' | 'galeria') => {
    const dispositivoValido = await validarDispositivo(origen);

    if (!dispositivoValido) {
      return;
    }

    Alert.alert('Modo de imagen', '¿Cómo desea cargar la imagen del producto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tal cual', onPress: () => cargarImagen(origen, false) },
      { text: 'Recortar', onPress: () => cargarImagen(origen, true) },
    ]);
  };

  const actualizarPrecio = (texto: string) => {
    setPrecio(texto.replace(/[^0-9]/g, ''));
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
    if (!/^[0-9]+$/.test(precio.trim())) {
      Alert.alert('Advertencia', 'El precio solo puede contener números.');
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
        <Text style={styles.cardAyuda}>Agrega una imagen del producto y completa los datos.</Text>
      </View>

      <View style={styles.fotoPanel}>
        <View style={styles.fotoHeader}>
          <View>
            <Text style={styles.fotoTitulo}>Foto del producto</Text>
            <Text style={styles.fotoSubtitulo}>Valida cámara o galería antes de cargar la imagen.</Text>
          </View>
          <Text style={[styles.estadoFoto, imagen ? styles.estadoFotoLista : null]}>
            {imagen ? 'Lista' : 'Pendiente'}
          </Text>
        </View>

        <View style={styles.fotoPreview}>
          {imagen ? (
            <>
              <Image source={{ uri: imagen }} style={styles.imagen} />
              <View style={styles.fotoOverlay}>
                <Text style={styles.fotoOverlayTexto}>{modoImagen}</Text>
              </View>
            </>
          ) : (
            <View style={styles.contenedorVacio}>
              <View style={styles.iconoFoto}>
                <Text style={styles.iconoFotoTexto}>📎</Text>
              </View>
              <Text style={styles.textoVacioTitulo}>Sin imagen del producto</Text>
              <Text style={styles.textoVacio}>Adjunta una foto clara desde cámara o galería.</Text>
            </View>
          )}
        </View>

        <View style={styles.fotoAcciones}>
          <TouchableOpacity
            style={[styles.botonAdjuntar, mostrarAdjuntos ? styles.botonAdjuntarActivo : null]}
            onPress={() => setMostrarAdjuntos((actual) => !actual)}
          >
            <Text style={[styles.textoAdjuntar, mostrarAdjuntos ? styles.textoAdjuntarActivo : null]}>
              📎
            </Text>
          </TouchableOpacity>

          <View style={styles.dispositivoInfo}>
            <Text style={styles.dispositivoLabel}>Validación de dispositivo</Text>
            <Text style={styles.dispositivoValor}>{estadoDispositivo}</Text>
            <Text style={styles.dispositivoModo}>{modoImagen}</Text>
          </View>
        </View>

        {mostrarAdjuntos ? (
          <View style={styles.menuAdjuntos}>
            <TouchableOpacity style={styles.opcionAdjunto} onPress={() => elegirModoImagen('camara')}>
              <Text style={styles.opcionAdjuntoTitulo}>Tomar foto</Text>
              <Text style={styles.opcionAdjuntoTexto}>Tal cual o recortar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcionAdjunto} onPress={() => elegirModoImagen('galeria')}>
              <Text style={styles.opcionAdjuntoTitulo}>Galería</Text>
              <Text style={styles.opcionAdjuntoTexto}>Tal cual o recortar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {imagen ? (
          <TouchableOpacity
            style={styles.botonQuitarImagen}
            onPress={() => {
              setImagen(null);
              setEstadoDispositivo('Imagen retirada');
              setModoImagen('Sin imagen');
            }}
          >
            <Text style={styles.textoQuitarImagen}>Quitar imagen</Text>
          </TouchableOpacity>
        ) : null}
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
        onChangeText={actualizarPrecio}
        keyboardType="number-pad"
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
  fotoPanel: {
    backgroundColor: '#FBFDFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 10,
    marginBottom: 6,
  },
  fotoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  fotoTitulo: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },
  fotoSubtitulo: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  estadoFoto: {
    color: '#8A6D1D',
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F0D99C',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  estadoFotoLista: {
    color: COLORS.brandDark,
    backgroundColor: '#EAF6EE',
    borderColor: '#CFE9D7',
  },
  fotoPreview: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  imagen: {
    width: '100%',
    height: 135,
    resizeMode: 'cover',
  },
  fotoOverlay: {
    position: 'absolute',
    left: 12,
    bottom: 10,
    backgroundColor: 'rgba(15, 26, 18, 0.78)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  fotoOverlayTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  contenedorVacio: {
    width: '100%',
    minHeight: 125,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F7FBF8',
  },
  iconoFoto: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EAF6EE',
    borderWidth: 1,
    borderColor: '#CFE9D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  iconoFotoTexto: {
    fontSize: 17,
  },
  textoVacioTitulo: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  textoVacio: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  fotoAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botonAdjuntar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF6EE',
    borderWidth: 1,
    borderColor: '#CFE9D7',
  },
  botonAdjuntarActivo: {
    backgroundColor: COLORS.brandDark,
    borderColor: COLORS.brandDark,
  },
  textoAdjuntar: {
    color: COLORS.brandDark,
    fontSize: 20,
    fontWeight: '900',
  },
  textoAdjuntarActivo: {
    color: '#FFFFFF',
  },
  dispositivoInfo: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  dispositivoLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dispositivoValor: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
  dispositivoModo: {
    color: COLORS.brandDark,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  menuAdjuntos: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  opcionAdjunto: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
  },
  opcionAdjuntoTitulo: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },
  opcionAdjuntoTexto: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },
  botonQuitarImagen: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#F5CACA',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  textoQuitarImagen: {
    color: COLORS.danger,
    fontSize: 12,
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
