import { Planeta } from "./Planeta.js";
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

    const objeto = jsonToObject(cadena) || []; 

    objeto.forEach(obj => {
        const model = new Planeta(
            obj.id,
            obj.nombre,
            obj.tamaño,
            obj.masa,
            obj.tipo,
            obj.distAlSol,
            obj.anillos,
            obj.vida,
            obj.composicion
        );
        items.push(model);
    });

    rellenarTabla();
    ocultarSpinner();
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
        "distAlSol",
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

                let botonModificar = document.createElement("button");
                botonModificar.textContent = "Modificar";
                botonModificar.classList.add("btn-modificar");
                botonModificar.href = "#form-item";
                botonModificar.addEventListener("click", () => ModificarItem(item.id));
                nuevaCelda.appendChild(botonModificar);
            } else {
                nuevaCelda.textContent = item[celda] !== "" ? item[celda] : " - ";
            }
            nuevaFila.appendChild(nuevaCelda);
        });
        tbody.appendChild(nuevaFila);
    });
}

function escucharFormulario() {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const editarId = form.querySelector("#editarId").value;
        const anillos = form.querySelector("#anillos").checked ? "SI" : "NO";
        const vida = form.querySelector("#vida").checked ? "SI" : "NO";

        const model = new Planeta(
            editarId ? parseInt(editarId) : new Date().getTime(),
            form.querySelector("#txtnombre").value,
            form.querySelector("#txttamaño").value,
            form.querySelector("#txtmasa").value,
            form.querySelector("#tipo-planet").value,
            form.querySelector("#txtdisSol").value,
            anillos,
            vida,
            form.querySelector("#composicion").value
        );

        const resp = model.verify();

        if (resp.success) {
            mostrarSpinner();
            
            if (editarId) {
                const index = items.findIndex(item => item.id === parseInt(editarId));
                if (index !== -1) {
                    items[index] = model;
                }
            } else {
                items.push(model);
            }

            const str = objectToJson(items);
            await escribir(KEY_STORAGE, str);

            actualizarFormulario();
            rellenarTabla();
            ocultarSpinner();
        } else {
            alert(resp.rta);
        }
    });
}

function actualizarFormulario() {
    form.reset();
    form.querySelector("#editarId").value = "";
    form.querySelector(".btn-send").textContent = "Guardar";
}

async function eliminarItem(id) {
    mostrarSpinner();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items.splice(index, 1);
        const str = objectToJson(items);
        await escribir(KEY_STORAGE, str);
        rellenarTabla();
    }
    ocultarSpinner();
}

function ModificarItem(id) {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        const item = items[index];
        
        form.querySelector("#editarId").value = item.id;
        form.querySelector("#txtnombre").value = item.nombre;
        form.querySelector("#txttamaño").value = item.tamaño;
        form.querySelector("#txtmasa").value = item.masa;
        form.querySelector("#tipo-planet").value = item.tipo;
        form.querySelector("#txtdisSol").value = item.distAlSol;
        
        form.querySelector("#anillos").checked = item.anillos === "SI";
        form.querySelector("#vida").checked = item.vida === "SI";

        form.querySelector("#composicion").value = item.composicion;

        form.querySelector(".btn-send").textContent = "Modificar";

        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function escuchandoBtnDeleteAll() {
    const btn = document.getElementById("btn-delete-all");

    btn.addEventListener("click", async (e) => {
        const rta = confirm('Deseas eliminar todos los Items?');

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

const yearElement = document.getElementById('year');

const year = new Date().getFullYear();
yearElement.textContent = year;