<?php include('php/header.inc.php'); ?>
<div class="container">
<iframe class="osm" border="0" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox=-6.701660156249999%2C45.75219336063106%2C22.1044921875%2C56.29215668507645&amp;layer=mapnik" style="border: 1px solid black"></iframe>
<?php
print "street: ".$_POST["street"];
?>
</div>
<?php include('php/footer.inc.php'); ?>
