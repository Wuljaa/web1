const mjesta = [
    { naziv: "MAVI", tip: "Fast Food", lokacija: "Trg Eugena Kvaternika 5", ocjena: 4 },
    { naziv: "Pekara Klas", tip: "Pekara", lokacija: "Petra Preradovića 12", ocjena: 5 },
    { naziv: "Restoran Madera", tip: "Restoran", lokacija: "Ljudevita Gaja 20", ocjena: 3 }
];

function prikaziMjesta() {
    const tabela = document.getElementById("tabela-mjesta");
    tabela.innerHTML = "";
    mjesta.forEach((mjesto, index) => {
        tabela.innerHTML += `
      <tr>
        <td>${mjesto.naziv}</td>
        <td>${mjesto.tip}</td>
        <td>${mjesto.lokacija}</td>
        <td>${"★".repeat(mjesto.ocjena)}${"☆".repeat(5 - mjesto.ocjena)}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="uredi(${index})">Uredi</button>
          <button class="btn btn-danger btn-sm" onclick="izbrisi(${index})">Izbriši</button>
        </td>
      </tr>
    `;
    });
}

function uredi(index) {
    const mjesto = mjesta[index];
    const novoIme = prompt("Uredi naziv mjesta:", mjesto.naziv);
    if (novoIme) {
        mjesto.naziv = novoIme;
        prikaziMjesta();
    }
}

function izbrisi(index) {
    if (confirm("Jesi siguran da želiš obrisati ovo mjesto?")) {
        mjesta.splice(index, 1);
        prikaziMjesta();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("forma-dodaj");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const naziv = document.getElementById("naziv").value;
            const tip = document.getElementById("tip").value;
            const lokacija = document.getElementById("lokacija").value;
            const ocjena = parseInt(document.getElementById("ocjena").value);

            // privremeno dodavanje u niz
            mjesta.push({ naziv, tip, lokacija, ocjena });

            // opcionalno
            localStorage.setItem("mjesta", JSON.stringify(mjesta));
            prikaziMjesta(); // novo mjesto na index.html

            alert("Mjesto dodano!");
            form.reset();
        });
    }
});



window.onload = prikaziMjesta;