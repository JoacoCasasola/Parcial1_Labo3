import { PlanetaBase } from "./PlanetaBase.js";

class Planeta extends PlanetaBase {
    constructor(id, nombre, tamaño, masa, tipo, distAlSol, anillos, vida, composicion) {
        super(id, nombre, tamaño, masa, tipo);
        this.distAlSol = +distAlSol;
        this.anillos = anillos;
        this.vida = vida;
        this.composicion = composicion;
    }

    verify() {
        let errors = [];

        if (!this.nombre || this.nombre.trim() === '') {
            errors.push("El nombre es obligatorio.");
        }
        if (isNaN(this.tamaño) || this.tamaño <= 0) {
            errors.push("El tamaño debe ser un número positivo.");
        }
        if (isNaN(this.masa) || this.masa <= 0) {
            errors.push("La masa debe ser un número positivo.");
        }
        if (!this.tipo || this.tipo.trim() === '') {
            errors.push("El tipo es obligatorio.");
        }
        if (isNaN(this.distAlSol) || this.distAlSol <= 0) {
            errors.push("La distancia al sol debe ser un número positivo.");
        }
        if (!this.composicion || this.composicion.trim() === '') {
            errors.push("La composición es obligatoria.");
        }

        return {
            success: errors.length === 0,
            rta: errors.join("\n")
        };
    }
}

export { Planeta };