# Drinking water visualization: Hardness, contents and cost

* In the converter/ folder, you find raw data and small scripts that will process the rawdata into a model for the website
* In the src/ folder, you will find HTML, CSS und JavaScript that will visualize the drinkingwater information.
* When you use grunt, a build directory will be created with translated sections for all supported languages.

# i18n

This project uses transifex for translation. Translations can be found or created at https://www.transifex.com/codeforeurope/trinkwasser/languages/
Please install the transifex client to pull languages.
Install your login credentials to ~/.transifexrc

```
[https://www.transifex.com]
hostname = https://www.transifex.com
password = pwd
token =
username = username

```
## To pull down locale
```shell
tx pull -a
```
## After editing localisation changes in lang/locale/{in}
### If you not in the language team for it won't let you write
### Delete the other languages before saving the .po file you edited and executing..
```shell
tx push -t
```

# Run

```bash
npm install -g grunt
npm install -g http-server
npm install
npm start
```

# Git before pushing your changes please do a pull request
```shell
git pull https://github.com/codeforeurope/trinkwasser.git master
```

# Sources:

* Stadtwerke Heilbronn: https://www.stadtwerke-heilbronn.de/index/hsw/Wasserh%C3%A4rte.html
* Stadtwerke Neckarsulm: http://www.sw-neckarsulm.de/main/produkte/trinkwasser/wasseranalyse.html
