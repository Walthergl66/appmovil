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
  const [mostrarAdjuntos, setMostrarAdjuntos] = useState(false);
  const [estadoPermiso, setEstadoPermiso] = useState('Pendiente de validación');
  const [ultimoEvento, setUltimoEvento] = useState('Sin actividad registrada');

  const registrarAuditoria = (accion: string, detalle: string) => {
    const evento = {
      accion,
      detalle,
      fecha: new Date().toISOString(),
    };

    setUltimoEvento(`${accion}: ${detalle}`);
    console.log('[AUDITORIA_RESEÑA]', evento);
  };

  const validarPermiso = async (origen: 'camara' | 'galeria') => {
    const solicitarPermiso =
      origen === 'camara'
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;
    const permiso = await solicitarPermiso();

    if (!permiso.granted) {
      const detalle =
        origen === 'camara'
          ? 'Permiso de cámara denegado'
          : 'Permiso de galería denegado';

      setEstadoPermiso('Permiso denegado');
      registrarAuditoria('permiso_denegado', detalle);
      Alert.alert(
        'Permiso requerido',
        origen === 'camara'
          ? 'Debe permitir el acceso a la cámara para tomar evidencia.'
          : 'Debe permitir el acceso a la galería para subir evidencia.'
      );
      return false;
    }

    setEstadoPermiso('Permiso validado');
    registrarAuditoria(
      'permiso_validado',
      origen === 'camara' ? 'Cámara habilitada para evidencia' : 'Galería habilitada para evidencia'
    );
    return true;
  };

  const seleccionarImagen = async () => {
    const tienePermiso = await validarPermiso('galeria');

    if (!tienePermiso) {
      return;
    }

    registrarAuditoria('abrir_galeria', 'Usuario abrió selector de evidencia');
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (resultado.canceled) {
      registrarAuditoria('seleccion_cancelada', 'Usuario canceló la selección desde galería');
      return;
    }

    setEvidencia(resultado.assets[0].uri);
    setMostrarAdjuntos(false);
    registrarAuditoria('evidencia_cargada', 'Imagen agregada desde galería');
  };

  const tomarFoto = async () => {
    const tienePermiso = await validarPermiso('camara');

    if (!tienePermiso) {
      return;
    }

    registrarAuditoria('abrir_camara', 'Usuario abrió cámara para evidencia');
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (resultado.canceled) {
      registrarAuditoria('captura_cancelada', 'Usuario canceló la captura desde cámara');
      return;
    }

    setEvidencia(resultado.assets[0].uri);
    setMostrarAdjuntos(false);
    registrarAuditoria('evidencia_cargada', 'Imagen agregada desde cámara');
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
    registrarAuditoria('reseña_guardada', `Reseña registrada con fecha ${formatearFecha(creadoEn)}`);

    setEvidencia(null);
    setDescripcion('');
    setMostrarAdjuntos(false);
  };

  const confirmarEliminacion = (id: string) => {
    Alert.alert('Eliminar reseña', '¿Seguro que desea eliminar esta reseña?', [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: () => registrarAuditoria('eliminacion_cancelada', `Reseña ${id}`),
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          onEliminar(id);
          registrarAuditoria('reseña_eliminada', `Reseña ${id}`);
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.seccionTitulo}>
        <Text style={styles.cardTitulo}>Reseñas del producto</Text>
        <Text style={styles.cardAyuda}>Comenta tu experiencia y adjunta evidencia si el producto lo requiere.</Text>
      </View>

      <View style={styles.comentarioBox}>
        <View style={styles.comentarioHeader}>
          <Text style={styles.comentarioTitulo}>Nueva reseña</Text>
          <Text style={[styles.comentarioEstado, evidencia ? styles.comentarioEstadoListo : null]}>
            {evidencia ? 'Evidencia cargada' : 'Sin evidencia'}
          </Text>
        </View>

        <View style={styles.comentarioBarra}>
          <TextInput
            style={styles.comentarioInput}
            placeholder="Escribe tu reseña..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            placeholderTextColor={COLORS.muted}
          />

          <TouchableOpacity
            style={[styles.botonAdjuntar, mostrarAdjuntos ? styles.botonAdjuntarActivo : null]}
            onPress={() => setMostrarAdjuntos((actual) => !actual)}
          >
            <Text style={[styles.textoAdjuntar, mostrarAdjuntos ? styles.textoAdjuntarActivo : null]}>
              Clip
            </Text>
          </TouchableOpacity>
        </View>

        {mostrarAdjuntos ? (
          <View style={styles.menuAdjuntos}>
            <TouchableOpacity style={styles.opcionAdjunto} onPress={tomarFoto}>
              <Text style={styles.opcionAdjuntoTitulo}>Tomar foto</Text>
              <Text style={styles.opcionAdjuntoTexto}>Abrir cámara</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.opcionAdjunto} onPress={seleccionarImagen}>
              <Text style={styles.opcionAdjuntoTitulo}>Galería</Text>
              <Text style={styles.opcionAdjuntoTexto}>Elegir imagen</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {evidencia ? (
          <View style={styles.evidenciaMiniCard}>
            <Image source={{ uri: evidencia }} style={styles.evidenciaMini} />
            <View style={styles.evidenciaMiniInfo}>
              <Text style={styles.evidenciaMiniTitulo}>Evidencia adjunta</Text>
              <Text style={styles.evidenciaMiniTexto}>La imagen se publicará con la reseña.</Text>
            </View>
            <TouchableOpacity
              style={styles.botonQuitar}
              onPress={() => {
                setEvidencia(null);
                registrarAuditoria('evidencia_eliminada', 'Usuario quitó la imagen antes de publicar');
              }}
            >
              <Text style={styles.textoQuitar}>Quitar</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.comentarioFooter}>
          <View style={styles.auditoriaCompacta}>
            <Text style={styles.auditoriaCompactaTexto}>Permiso: {estadoPermiso}</Text>
            <Text style={styles.auditoriaCompactaTexto} numberOfLines={1}>
              Registro: {ultimoEvento}
            </Text>
          </View>

          <TouchableOpacity style={[styles.boton, styles.botonGuardar]} onPress={guardar}>
            <Text style={styles.textoBoton}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  comentarioBox: {
    backgroundColor: '#FBFDFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginTop: 12,
  },
  comentarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  comentarioTitulo: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  comentarioEstado: {
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
  comentarioEstadoListo: {
    color: COLORS.brandDark,
    backgroundColor: '#EAF6EE',
    borderColor: '#CFE9D7',
  },
  comentarioBarra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 8,
  },
  comentarioInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  botonAdjuntar: {
    width: 62,
    minHeight: 42,
    borderRadius: 12,
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
    fontSize: 13,
    fontWeight: '900',
  },
  textoAdjuntarActivo: {
    color: '#FFFFFF',
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
    padding: 12,
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
  evidenciaMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    marginTop: 10,
  },
  evidenciaMini: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#F7FAF8',
  },
  evidenciaMiniInfo: {
    flex: 1,
  },
  evidenciaMiniTitulo: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  evidenciaMiniTexto: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },
  botonQuitar: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#F5CACA',
  },
  textoQuitar: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '900',
  },
  comentarioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  auditoriaCompacta: {
    flex: 1,
  },
  auditoriaCompactaTexto: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  evidenciaPanel: {
    backgroundColor: '#FBFDFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 12,
    marginTop: 12,
  },
  evidenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  evidenciaTitulo: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  evidenciaSubtitulo: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  estadoBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  estadoBadgePendiente: {
    backgroundColor: '#FFF8E8',
    borderColor: '#F0D99C',
  },
  estadoBadgeListo: {
    backgroundColor: '#EAF6EE',
    borderColor: '#CFE9D7',
  },
  estadoBadgeTexto: {
    color: '#8A6D1D',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  estadoBadgeTextoListo: {
    color: COLORS.brandDark,
  },
  previewShell: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  imagen: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: 'rgba(15, 26, 18, 0.78)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewOverlayTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  contenedorVacio: {
    width: '100%',
    minHeight: 190,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#F7FAF8',
  },
  iconoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EAF6EE',
    borderWidth: 1,
    borderColor: '#CFE9D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconoPlaceholderTexto: {
    color: COLORS.brandDark,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
  },
  textoVacioTitulo: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },
  textoVacio: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  panelAuditoria: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  auditoriaTitulo: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  auditoriaLinea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  auditoriaValor: {
    color: COLORS.brandDark,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
  },
  auditoriaSeparador: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 9,
  },
  auditoriaTexto: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
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
    width: 126,
    backgroundColor: '#EAF6EE',
    borderWidth: 1,
    borderColor: '#CFE9D7',
  },
  botonGuardar: {
    backgroundColor: COLORS.brandDark,
    minWidth: 96,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textoBotonAyuda: {
    color: '#F2FFF1',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  textoBotonSecundario: {
    color: COLORS.brandDark,
    fontSize: 14,
    fontWeight: '800',
  },
  textoBotonSecundarioAyuda: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
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
