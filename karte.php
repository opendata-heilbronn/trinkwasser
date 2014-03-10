<?php 
header('Content-Type: text/html; charset=utf-8');
include('php/header.inc.php'); ?>
<div class="container">
<iframe class="osm" border="0" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox=-6.701660156249999%2C45.75219336063106%2C22.1044921875%2C56.29215668507645&amp;layer=mapnik" style="border: 1px solid black"></iframe>
<?php
$street=$_POST["street"];

$haert_json=json_decode(file_get_contents("data-haertegrad.txt"),true);

function dump_haert($ident, $mark = false) {
	global $haert_json;

	foreach($haert_json as $k => $v) {
		if (substr($k, -strlen($ident)) === $ident) {
		//if ($k == $ident) {
			$classname=$mark?"success":"normal";
			print "<tr class=\"".$classname."\"><td>".$k."</td>";
			foreach ($v as $k2 => $v2) {
				  print "<td>".$v2."</td>";
			}
			print "</tr>";
		}
	}
}

function dump_haert_header() {
	global $haert_json;

	print "<tr><th>Name</th>";
	foreach ($haert_json["Volvic"] as $k2 => $v2) {
		print "<th>".$k2."</th>";
	}
	print "</tr>";
}



$handle = fopen("data.txt", "r");
if ($handle) {
	$found = false;
    while (($line = fgets($handle)) !== false) {
        $arr = explode(";", $line);
        if (strtolower($arr[0]) == strtolower($street)) {
        	$found = true;
        	
        	if (preg_match('/^([0-9]+)-([0-9]+)/', $arr[1], $matches)) {
        		$grad_from = $matches[1];
        		$grad_to = $matches[2];
        	} else if (preg_match('/^([0-9]+)/', $arr[1], $matches)) {
				$grad_from = $matches[1];
				$grad_to = $grad_from;
        	} else {
        		$grad_from = -1;
        		$grad_to = -1;	
        	}	
        	
            print utf8_encode("<h1>Ergebnis für ".$arr[0]."</h1>");
            print "H&auml;rtegrad: ".$arr[1]; 

            print '<br><br><div class="table-responsive"><table class="table">';
			dump_haert_header();

            dump_haert("grad 10-11", 	(($grad_from >= 10) and ($grad_to <= 11)));
            dump_haert("grad 14", 		(($grad_from == 14) and ($grad_to == 14)));
            dump_haert("grad 14-18", 	((($grad_from >= 14) and ($grad_to != 14)) and ($grad_to <= 18)));

            dump_haert("Gemminger Mineralquelle");
            dump_haert("wenstein)");
            dump_haert("Volvic");
            print "</table></div>";
        }
    }
    if ($found == false) {
    	print "<h1>No Data available for given street name. Please contact siteowner.</h1>";
    }
} else {
    print "<h1>Internal Error, Data not available. Please contact siteowner.</h1>";
}

?>
</div>
<?php include('php/footer.inc.php'); ?>
