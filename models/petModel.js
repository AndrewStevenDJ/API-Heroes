class Pet {
  constructor(id, nombre, tipo, superpoder, duenioId = null) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.superpoder = superpoder;
    this.duenioId = duenioId; // id del superhéroe que la adoptó (opcional)
  }
}

export default Pet; 