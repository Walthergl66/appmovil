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
      <Image
        source={require('./assets/nexologo.jpeg')}
        style={styles.logo}
        accessibilityLabel="Logo Nexologo"
      />

      <Text style={styles.titulo}>NexoCatálogo</Text>

      <Text style={styles.subtitulo}>
        Emprendimiento sencillo: registra productos con foto desde la cámara
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Foto del producto:</Text>

        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagen} />
        ) : (
          <View style={styles.contenedorVacio}>
            <Text style={styles.textoVacio}>Aún no hay foto</Text>
          </View>
        )}

        <TouchableOpacity style={styles.botonCamara} onPress={tomarFoto}>
          <Text style={styles.textoBoton}>Tomar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonGaleria} onPress={seleccionarImagen}>
          <Text style={styles.textoBoton}>Elegir de galería</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nombre:</Text>

        <TextInput
          style={styles.input}
          placeholder="Ej: Taza personalizada"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Precio:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 25.000"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.inputMultiline}
          placeholder="Detalles, materiales, talla, etc."
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <TouchableOpacity style={styles.botonGuardar} onPress={guardarProducto}>
          <Text style={styles.textoBoton}>Guardar producto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarFormulario}>
          <Text style={styles.textoBoton}>Limpiar formulario</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lista}>
        <Text style={styles.tituloLista}>Catálogo ({productos.length})</Text>

        {productos.length === 0 ? (
          <Text style={styles.textoListaVacia}>Aún no has agregado productos.</Text>
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
    backgroundColor: '#eef3f8',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignSelf: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#123456',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
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
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  textoVacio: {
    color: '#777',
    fontSize: 15,
  },
  botonCamara: {
    backgroundColor: '#1565c0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonGaleria: {
    backgroundColor: '#00897b',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  botonGuardar: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  botonLimpiar: {
    backgroundColor: '#757575',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  inputMultiline: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  lista: {
    marginTop: 18,
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#123456',
    marginBottom: 10,
  },
  textoListaVacia: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
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
    color: '#222',
  },
  itemPrecio: {
    marginTop: 2,
    fontSize: 15,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  itemDescripcion: {
    marginTop: 6,
    color: '#555',
    fontSize: 13,
  },
});