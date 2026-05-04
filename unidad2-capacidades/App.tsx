import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

type Producto = {
  id: string;
  nombre: string;
  precio: string;
  descripcion: string;
  fotoUri: string;
  creadoEn: number;
};

const COLORS = {
  bg: '#F3FBF4',
  surface: '#FFFFFF',
  text: '#0F1A12',
  muted: '#5B6B60',
  border: '#DDEBE0',
  brand: '#63B547',
  brandDark: '#2F8A2E',
  danger: '#D64545',
};

export default function App() {
  const [imagen, setImagen] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);

  // FUNCIÓN PARA SELECCIONAR IMAGEN DESDE GALERÍA
  const seleccionarImagen = async () => {
    // Pedir permiso para acceder a la galería
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        'Permiso requerido',
        'Debe permitir el acceso a la galería para seleccionar una imagen.'
      );
      return;
    }

    // Abrir galería
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Verificar si el usuario seleccionó una imagen
    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  // FUNCIÓN PARA TOMAR FOTO CON LA CÁMARA
  const tomarFoto = async () => {
    // Pedir permiso para usar la cámara
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert(
        'Permiso requerido',
        'Debe permitir el acceso a la cámara para tomar una foto.'
      );
      return;
    }

    // Abrir cámara
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Verificar si el usuario tomó una foto
    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  // FUNCIÓN PARA GUARDAR PRODUCTO (emprendimiento)
  const guardarProducto = () => {
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
    const producto: Producto = {
      id: `${creadoEn}`,
      nombre: nombre.trim(),
      precio: precio.trim(),
      descripcion: descripcion.trim(),
      fotoUri: imagen,
      creadoEn,
    };

    setProductos((prev) => [producto, ...prev]);
    Alert.alert('Producto guardado', 'Se agregó al catálogo local.');

    setImagen(null);
    setNombre('');
    setPrecio('');
    setDescripcion('');
  };

  // FUNCIÓN PARA LIMPIAR EL FORMULARIO
  const limpiarFormulario = () => {
    setImagen(null);
    setNombre('');
    setPrecio('');
    setDescripcion('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <Image
            source={require('./assets/nexologo.jpeg')}
            style={styles.logo}
            accessibilityLabel="Logo Nexologo"
          />
        </View>
        <Text style={styles.titulo}>NexoCatálogo</Text>
        <Text style={styles.subtitulo}>
          Registra productos con foto y guárdalos en tu catálogo
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.seccionTitulo}>
          <Text style={styles.cardTitulo}>Nuevo producto</Text>
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

          <TouchableOpacity
            style={[styles.boton, styles.botonSecundario]}
            onPress={seleccionarImagen}
          >
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

        <TouchableOpacity style={[styles.boton, styles.botonGuardar]} onPress={guardarProducto}>
          <Text style={styles.textoBoton}>Guardar producto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.boton, styles.botonLimpiar]} onPress={limpiarFormulario}>
          <Text style={styles.textoBotonLimpiar}>Limpiar formulario</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lista}>
        <Text style={styles.tituloLista}>Catálogo ({productos.length})</Text>

        {productos.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.textoListaVacia}>Aún no has agregado productos.</Text>
            <Text style={styles.textoListaVaciaAyuda}>
              Empieza creando tu primer producto arriba.
            </Text>
          </View>
        ) : (
          productos.map((p) => (
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
          ))
        )}
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
  lista: {
    marginTop: 18,
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
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