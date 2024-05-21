import { Planeta } from "./PlanetaBase.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local-storage.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const KEY_STORAGE = "planet-key";
const items = [];
const form = document.getElementById("form-item");

document.addEventListener("DOMContentLoaded", onInit);

function onInit() {
    loadItems();
    escucharFormulario();
    escuchandoBtnDeleteAll();
}

async function loadItems() {
    mostrarSpinner();
    let cadena = await leer(KEY_STORAGE);
    ocultarSpinner();

    const objeto = jsonToObject(cadena) || []; 

    objeto.forEach(obj => {
        const model = new Planeta(
            obj.nombre,
            obj.tamaño,
            obj.masa,
            obj.tipo,
            obj.distSol,
            obj.anillos,
            obj.vida,
            obj.composicion
        );
        items.push(model);
    });
    rellenarTabla();
}

function rellenarTabla() {
    const tabla = document.getElementById("table");
    let tbody = tabla.getElementsByTagName("tbody")[0];

    tbody.innerHTML = '';
    const celdas = [
        "nombre",
        "tamaño",
        "masa",
        "tipo",
        "distSol",
        "anillos",
        "vida",
        "composicion",
        "accion"
    ];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");

        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            if (celda === "accion") {
                let botonEliminar = document.createElement("button");
                botonEliminar.textContent = "Eliminar";
                botonEliminar.classList.add("btn-eliminar");
                botonEliminar.addEventListener("click", () => eliminarItem(item.id));
                nuevaCelda.appendChild(botonEliminar);
            } else {
                nuevaCelda.textContent = item[celda] !== "" ? item[celda] : " - ";
            }
            nuevaFila.appendChild(nuevaCelda);
        });
        tbody.appendChild(nuevaFila);
    });
}

function escucharFormulario() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        var fechaActual = new Date();

        let anillos = form.querySelector("#anillos");
        let vida = form.querySelector("#vida");

        let valanillos = form.querySelector("#anillos").value;
        let valvida = form.querySelector("#vida").value;

        if (anillos.type === "radio" && vida.type === "radio"){
            valvida = vida.checked;
            valanillos = anillos.checked;

            if(valvida == true){
                valvida = "SI";
            }
            else{
                valvida = "NO";
            }

            if(valanillos == true){
                valanillos = "SI";
            }
            else{
                valanillos = "NO";
            }
        } 

        const model = new Planeta(
            fechaActual.getTime(),
            form.querySelector("#txtnombre").value,
            form.querySelector("#txttamaño").value,
            form.querySelector("#txtmasa").value,
            form.querySelector("#tipo-planet").value,
            form.querySelector("#txtdisSol").value,
            valanillos,
            valvida,
            form.querySelector("#composicion").value
        );

        const resp = model.verify();

        if (resp.success) {
            items.push(model);
            const str = objectToJson(items);
            escribir(KEY_STORAGE, str);

            actualizarFormulario();
            rellenarTabla();
        } else {
            alert(resp.rta);
        }
    });
}

function actualizarFormulario() {
    form.reset();
}

function eliminarItem(id) {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items.splice(index, 1);
        const str = objectToJson(items);
        escribir(KEY_STORAGE, str);
        rellenarTabla();
    }
}

function escuchandoBtnDeleteAll() {
    const btn = document.getElementById("btn-delete-all");

    btn.addEventListener("click", async (e) => {
        const rta = confirm('Desea eliminar todos los Items?');

        if (rta) {
            mostrarSpinner();
            items.splice(0, items.length);

            try {
                await limpiar(KEY_STORAGE);
                rellenarTabla();
            } catch (error) {
                ocultarSpinner();
                alert(error);
            }
            ocultarSpinner();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('year');

    const year = new Date().getFullYear();
    yearElement.textContent = year;
});