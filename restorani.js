const url = 'https://dev.vub.zone/sandbox/router.php';
const projekt = 'p_evuljankovic';
const perPage = 5;
let isLoggedIn = false;

// login
function login() {
    return $.ajax({
        url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            projekt: "p_evuljankovic",
            procedura: 'p_login',
            username: 'evuljankovic',
            password: 'koliko99'
        }),
        success: function(response) {
            const data = JSON.parse(response);
            if (!data.h_errcode || data.h_errcode === 0) {
                isLoggedIn = true;
                console.log('Login uspješan');
                if (data.data && data.data[0]) {
                    sessionStorage.setItem('user', JSON.stringify(data.data[0])); //spremi
                }
            }
        },
        error: function(err) {
            console.error('Login greška:', err);
            Swal.fire('Greška', 'Neuspješna prijava', 'error');
        }
    });
}

// prikaz restorana
function showRestorani(page = 1) {
    // provjerava login
    if (!isLoggedIn) {
        login().then(() => {
            if (isLoggedIn) {
                showRestorani(page);
            }
        });
        return;
    }

    const container = document.getElementById("restorani") || document.getElementById("container");
    if (!container) {
        console.error('Container element nije pronađen');
        return;
    }

    let tablica = '<button class="btn btn-success mb-3" onclick="insertFormRestoran(' + page + ')">Dodaj restoran</button>';
    tablica += '<table class="table table-striped"><thead><tr>';
    tablica += '<th>Naziv</th><th>Adresa</th><th>Opis</th><th>Ocjena</th><th>Akcije</th>';
    tablica += '</tr></thead><tbody>';

    $.ajax({
        url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            projekt: projekt,
            procedura: "p_get_restorani",
            perPage,
            page
        }),
        success: function(data) {
            try {
                const json = typeof data === 'string' ? JSON.parse(data) : data;

                if (json.h_errcode === 999) {
                    // ponovan login
                    isLoggedIn = false;
                    showRestorani(page);
                    return;
                }

                if (json.data && Array.isArray(json.data)) {
                    json.data.forEach(restoran => {
                        tablica += `<tr>
                            <td>${restoran.NAZIV || ''}</td>
                            <td>${restoran.ADRESA || ''}</td>
                            <td>${restoran.OPIS || ''}</td>
                            <td>${restoran.OCJENA || ''}</td>
                            <td>
                                <button class="btn btn-primary btn-sm" onclick="editRestoran(${restoran.ID}, ${page})">Uredi</button>
                                <button class="btn btn-danger btn-sm" onclick="delRestoran(${restoran.ID}, ${page})">Obriši</button>
                            </td>
                        </tr>`;
                    });
                }
            } catch (e) {
                console.error('Greška pri parsiranju podataka:', e);
            }

            tablica += '</tbody></table>';
            container.innerHTML = tablica;
        },
        error: function(err) {
            console.error('Greška pri dohvaćanju restorana:', err);
            Swal.fire('Greška', 'Neuspješno dohvaćanje podataka', 'error');
        }
    });
}

//insert
function insertFormRestoran(page) {
    const container = document.getElementById("restorani") || document.getElementById("container");
    if (!container) return;

    let output = '<h3>Dodaj novi restoran</h3>';
    output += '<table class="table table-hover"><tbody>';
    output += '<tr><th>Naziv</th><td><input type="text" class="form-control" id="NAZIV"></td></tr>';
    output += '<tr><th>Adresa</th><td><input type="text" class="form-control" id="ADRESA"></td></tr>';
    output += '<tr><th>Opis</th><td><textarea class="form-control" id="OPIS"></textarea></td></tr>';
    output += '<tr><th>Ocjena</th><td><input type="number" class="form-control" id="OCJENA" step="0.1" min="1" max="5"></td></tr>';
    output += '</tbody></table>';
    output += '<input type="hidden" id="ID" value="">';
    output += '<button class="btn btn-warning" onclick="spremiRestoran(' + page + ')">Spremi</button> ';
    output += '<button class="btn btn-secondary" onclick="showRestorani(' + page + ')">Odustani</button>';

    container.innerHTML = output;
}

//edit restorana
function editRestoran(ID, page) {
    if (!isLoggedIn) {
        login().then(() => {
            if (isLoggedIn) {
                editRestoran(ID, page);
            }
        });
        return;
    }

    $.ajax({
        url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            projekt,
            procedura: "p_get_restorani",
            ID
        }),
        success: function(data) {
            try {
                const json = typeof data === 'string' ? JSON.parse(data) : data;
                if (json.data && json.data[0]) {
                    const restoran = json.data[0];
                    insertFormRestoran(page);
                    $('#ID').val(restoran.ID);
                    $('#NAZIV').val(restoran.NAZIV);
                    $('#ADRESA').val(restoran.ADRESA);
                    $('#OPIS').val(restoran.OPIS);
                    $('#OCJENA').val(restoran.OCJENA);
                }
            } catch (e) {
                console.error('Greška pri editiranju:', e);
            }
        }
    });
}

//tu se sprema restoran
function spremiRestoran(page) {
    if (!isLoggedIn) {
        Swal.fire('Greška', 'Morate biti prijavljeni', 'error');
        return;
    }

    const ID = $('#ID').val() || null;
    const NAZIV = $('#NAZIV').val();
    const ADRESA = $('#ADRESA').val();
    const OPIS = $('#OPIS').val();
    const OCJENA = $('#OCJENA').val();

    if (!NAZIV || !ADRESA) {
        Swal.fire('Upozorenje', 'Naziv i adresa su obavezni', 'warning');
        return;
    }

    $.ajax({
        url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            projekt: projekt,
            procedura: "p_save_restorani",
            ID,
            NAZIV,
            ADRESA,
            OPIS,
            OCJENA
        }),
        success: function() {
            Swal.fire('Uspjeh', 'Restoran je uspješno spremljen!', 'success');
            showRestorani(page);
        },
        error: function(err) {
            console.error('Greška pri spremanju:', err);
            Swal.fire('Greška', 'Neuspješno spremanje', 'error');
        }
    });
}

// izbrisi restoran
function delRestoran(ID, page) {
    if (!isLoggedIn) {
        login().then(() => {
            if (isLoggedIn) {
                delRestoran(ID, page);
            }
        });
        return;
    }

    Swal.fire({
        title: 'Jeste li sigurni?',
        text: "Ova akcija se ne može poništiti!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Da, obriši!',
        cancelButtonText: 'Odustani'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    projekt: projekt,
                    procedura: "p_save_restorani",
                    ID,
                    ACTION: "delete"
                }),
                success: function() {
                    Swal.fire('Obrisano!', 'Restoran je uspješno obrisan.', 'success');
                    showRestorani(page);
                },
                error: function(err) {
                    console.error('Greška pri brisanju:', err);
                    Swal.fire('Greška', 'Neuspješno brisanje', 'error');
                }
            });
        }
    });
}

// ini
$(document).ready(function() {
    // automatski login 
    login().then(() => {
        if (isLoggedIn) {
            console.log('Korisnik je uspješno prijavljen');
        }
    });
});