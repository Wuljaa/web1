const mjesta = [
    { naziv: "MAVI", tip: "Fast Food", lokacija: "Trg Eugena Kvaternika 5", ocjena: 4 },
    { naziv: "Pekara Klas", tip: "Pekara", lokacija: "Petra Preradovića 12", ocjena: 5 },
    { naziv: "Restoran Madera", tip: "Restoran", lokacija: "Ljudevita Gaja 20", ocjena: 3 }
];

const recenzije = [
    { ime: "Ana", recenzija: "Odlično mjesto za brzu hranu!", ocjena: 4, datum: "2023-10-01" },
    { ime: "Marko", recenzija: "Pekara Klas ima najbolje pecivo.", ocjena: 5, datum: "2023-10-02" },
    { ime: "Ivana", recenzija: "Restoran Madera nudi odlične specijalitete.", ocjena: 3, datum: "2023-10-03" }
];

function prikaziMjesta() {
    const tabela = document.getElementById("tabela-mjesta");
    tabela.innerHTML = "";
    mjesta.forEach((m, index) => { /*trenutni objekt u petlji, njegov index, uzima iz const mjesta*/
        tabela.innerHTML += ` 
      <tr>
        <td>${m.naziv}</td>
        <td>${m.tip}</td>
        <td>${m.lokacija}</td>
        <td>${"★".repeat(m.ocjena)}${"☆".repeat(5 - m.ocjena)}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="uredi(${index})">Uredi</button>
          <button class="btn btn-danger btn-sm" onclick="izbrisi(${index})">Izbriši</button>
        </td>
      </tr>
    `;
    });
}

function prikaziRecenzije() {
    const tabela = document.getElementById("tabela-recenzije");
    tabela.innerHTML = "";
    recenzije.forEach((recenzija, index) => {
        tabela.innerHTML += `
      <tr>
        <td>${recenzija.ime}</td>
        <td>${recenzija.recenzija}</td>
        <td>${"★".repeat(recenzija.ocjena)}${"☆".repeat(5 - recenzija.ocjena)}</td>
        <td>${recenzija.datum}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="izbrisiRecenziju(${index})">Izbriši</button>
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
        swal.fire("Mjesto je obrisano.");
        prikaziMjesta();
    }
}

function izbrisiRecenziju(index) {
    if (confirm("Jesi siguran da želiš obrisati ovu recenziju?")) {
        recenzije.splice(index, 1);
        swal.fire("Recenzija je obrisana.");
        prikaziRecenzije();
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forma-dodaj");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault(); /*nema refresh*/

            const naziv = document.getElementById("naziv").value;
            const tip = document.getElementById("tip").value;
            const lokacija = document.getElementById("lokacija").value;
            const ocjena = parseInt(document.getElementById("ocjena").value);

            // privremeno dodavanje u niz
            mjesta.push({ naziv, tip, lokacija, ocjena });

            // opcionalno
            // localStorage.setItem("mjesta", JSON.stringify(mjesta)); Ne koristi se
            prikaziMjesta(); // novo mjesto na index.html

            Swal.fire('Mjesto je dodano.');
            form.reset(); /*za novi unos*/
        });
    }

    const formaRecenzije = document.getElementById("forma-dodaj-rec");
    if (formaRecenzije) {
        formaRecenzije.addEventListener("submit", function(e) {
            e.preventDefault();

            const ime = document.getElementById("rec-ime").value;
            const recenzija = document.getElementById("recenzija").value;
            const ocjena = parseInt(document.getElementById("rec-ocjena").value);
            const datum = document.getElementById("datepicker").value;

            recenzije.push({ ime, recenzija, ocjena, datum });

            //localStorage.setItem("recenzije", JSON.stringify(recenzije)); Ne koristi se
            prikaziRecenzije();

            Swal.fire('Recenzija je dodana.');
            formaRecenzije.reset();
        })
    }
});

function prikaziHranu() {
    console.log('Dohvaćam sliku hrane...');

    $.ajax({
        url: 'https://foodish-api.com/api/',
        method: 'GET',
        success: (data) => {
            const imgElement = document.getElementById('slika-hrane');
            if (imgElement) {
                imgElement.src = data["image"];
            } else {
                console.error('Element slike nije pronađen');
            }
        },
        error: function() {
            console.error('Greška pri dohvaćanju slike hrane');
        }
    });
}

// function prikaziSve() {
//     prikaziMjesta();
//     prikaziRecenzije();
//     prikaziHranu();
// }
// window.onload = prikaziSve;

window.onload = () => {
    prikaziMjesta();
    prikaziRecenzije();
    prikaziHranu();
};