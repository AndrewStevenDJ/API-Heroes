class Hero {
  constructor(id, name, alias, city, team, petId = null) {
    this.id = id;
    this.name = name;
    this.alias = alias;
    this.city = city;
    this.team = team;
    this.petId = petId; // id de la mascota adoptada (opcional)
  }
}

export default Hero;
