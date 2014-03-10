<?
header('Content-type: application/json');
$arr = array ('query'=>'Li','suggestions'=>array("Liberia","Liechtenstein","Lithuania"));

    echo json_encode($arr); // {"a":1,"b":2,"c":3,"d":4,"e":5}
?>

