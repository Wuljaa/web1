<?php
//HTTP headers
//HTTP headers let the client and the server pass additional information

//HTTP request or response. An HTTP header consists of its

//followed by a colon (:), then by its value. Whitespace before the value is ignored.
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
//Pomoću sljedećeg header
//Indicates whether the response can be shared.
header('Access-Control-Allow-Origin:http://localhost');
//Indicates whether the response to the request can be exposed when the
//credentials flag is true.
header('Access-Control-Allow-Credentials: true');

//fiksne poruke ovisno o tipu greške
$login_err = '{"h_message":"login redirect","h_errcode":999}';
$request_err = '{"h_message":"request error","h_errcode":998}';
$procedure_err = '{"h_message":"method error","h_errcode":997}';
$projekt_err = '{"h_message":"project error","h_errcode":996}';
$logout = '{"h_message":"Uspješno ste odjavljeni","h_errcode":0}';
//startam session
session_start();
//dohvaćam POST ili GET request
// u POST ili GET requestu smo uvijek slali json
//preko ajax poziva smo preuzeli kontrolu što će se slati
//prema serveru, slično smo podešavali i u POSTMANu

switch ($_SERVER['REQUEST_METHOD']) {
 case 'POST':
 $injson = json_encode($_POST);
 break;
 case 'GET':
 $injson = json_encode($_GET);
 break;
 default:
 echo $request_err;
 return;
}
$in_obj = json_decode($injson);
//nakon ove linije svi podaci koji su poslani u JSON formatu
//se sada nalaze u PHP objektu
//svojstvima PHP objekta se pristupa preko -> operatora

//logout
if($in_obj->procedura =="p_logout"){
 session_destroy();
 echo $logout;
 return;
}
//provjera da li je user logiran, ako nije mogu se samo zvati p_login i

if ($in_obj->procedura !="p_get_restorani"){
 if (!isset( $_SESSION['ID']) && $in_obj->procedura !="p_login") {
 echo $login_err;
 return;
 }
}

//refresh-am podatke, vraćam podatke iz session-a
if (isset($_SESSION['ID']) && $in_obj->procedura == "p_refresh") {
 echo json_encode($_SESSION);
 return;
}
//prepunjavam username i password za spajanje na bazu
switch($in_obj->projekt){
 case 'p_evuljankovic':
 $username = 'evuljankovic';
 $password = 'koliko99';
 break;
 default:
 echo $projekt_err;
 return;
}
//konekcija na bazu
$conn = oci_connect($username, $password, 'localhost/XE', 'AL32UTF8');

if (!$conn) {
 $e = oci_error();
 trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}
//poziv router procedure na bazi
//svi studenti sa svojim schemama na bazi su morali kreirati
//ROUTER proceduru pa ovisno na koju shemu sam se spojio
//tu ROUTER.P_MAIN proceduru sam pozivao
$sql = "begin ROUTER.P_MAIN(:IN_JSON, :OUT_JSON); end;";
//bindanje outputa, maksimalno mogu poslati i dohvatiti 32KB podataka
//$injson varijabla je popunjena s JSON input podacima, prema bazi šaljem
//JSON, a kad baza odgovori njen odgovor će se naći u $injson varijabli
//također u JSON formatu
$stid = oci_parse($conn, $sql);
oci_bind_by_name($stid, ":IN_JSON", $injson, 32768);
oci_bind_by_name($stid, ':OUT_JSON', $injson, 32768);
oci_execute($stid);

//dekodiram json u php objekt kako bi provjerio login i slične ključne metode
$out_obj = json_decode($outjson);
//postavljam korisnika u session, poznati user
if ($in_obj->procedura =="p_login" && (!isset($out_obj->h_errcod) ||
$out_obj->h_errcod =="")){
 //cijeli response p_login procedure prebacim u array problem je
 //u stdClass object pa moram raditi decode encode
 $array = json_decode(json_encode($out_obj->data[0]), True);
 foreach ($array as $key => $value){
 $_SESSION[$key] = $value;
 }
}
//vraćam nazad rezultat
echo $outjson;
//odspojim se s baze
oci_free_statement($stid);
oci_close($conn);
?>