<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>OpenDataDay Heilbronn - Wasserhärte</title>
  <link rel="stylesheet" href="/css/bootstrap.min.css">
  <link rel="stylesheet" href="/css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/autocomplete.css">
</head>
<body>

<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Menü einblenden</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/">Wasserhärte Heilbronn</a>
    </div>
 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li><a href="/karte.php">Karte</a></li>
        <li><a href="/info.php">Info</a></li>
      </ul> 
      <form class="navbar-form navbar-left" role="search" action="/karte.php" method="post">
        <div class="form-group ui-widget">
          <input type="search" class="form-control street" name="street" id="street" placeholder="Straßenname">
        </div>
        <button type="submit" class="btn btn-default">Suchen</button>
      </form>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="/kontakt.php">Kontakt</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
  </nav>