# Pruebas de Endpoints - API de Superhéroes y Mascotas

## Endpoints de Mascotas

### 1. Ver todas las mascotas
```bash
GET http://localhost:3000/mascotas
```

### 2. Ver mascotas disponibles (sin dueño)
```bash
GET http://localhost:3000/mascotas/disponibles
```

### 3. Alimentar una mascota
```bash
POST http://localhost:3000/mascotas/1/alimentar
```

### 4. Bañar una mascota
```bash
POST http://localhost:3000/mascotas/1/banar
```

### 5. Jugar con una mascota
```bash
POST http://localhost:3000/mascotas/1/jugar
```

### 6. Pasear con una mascota
```bash
POST http://localhost:3000/mascotas/1/pasear
```

### 7. Curar una mascota
```bash
POST http://localhost:3000/mascotas/1/curar
```

### 8. Ver ropa de una mascota
```bash
GET http://localhost:3000/mascotas/1/ropa
```

### 9. Cambiar ropa de una mascota
```bash
POST http://localhost:3000/mascotas/1/ropa
Content-Type: application/json

{
  "ropa": ["capa roja", "máscara", "botas"]
}
```

### 10. Ver estado completo de una mascota
```bash
GET http://localhost:3000/mascotas/1/estado
```

## Endpoints de Héroes

### 11. Ver todos los héroes
```bash
GET http://localhost:3000/heroes
```

### 12. Ver mascota de un héroe específico
```bash
GET http://localhost:3000/heroes/1/mascota
```

### 13. Adoptar una mascota
```bash
POST http://localhost:3000/heroes/1/adoptar-mascota
Content-Type: application/json

{
  "petId": 2
}
```

## Documentación Swagger
```bash
GET http://localhost:3000/api-docs
```

## Notas importantes:

1. **Simulación de tiempo**: Cada 60 segundos se actualizan automáticamente los estados de todas las mascotas.
2. **Valores máximos**: Hambre, felicidad y limpieza van de 0 a 20.
3. **Enfermedades**: Se activan cuando hambre >= 20, limpieza <= 2, o felicidad <= 2.
4. **Mensajes**: Cada acción devuelve un mensaje claro y descriptivo.
5. **Validaciones**: Se validan errores como mascota no encontrada, sobrealimentación, etc. 