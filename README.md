# Drinking water visualization: Hardness, contents and cost

* In the converter/ folder, you find raw data and small scripts that will process the rawdata int a model for the website
* In the src/ folder, you will find HTML, CSS und JavaScript that will visualize the drinkingwater information.
* When you run `grunt gh-pages` the online version will be renewed.

Online-Version: http://opendatalab.de/projects/trinkwasser/

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
```shell
tx push
```


# Run
```shell
npm install --dev #if set to normally install production dependencies only
```

```bash
npm install
npm start
```

# Sources:

* Stadtwerke Heilbronn: https://www.stadtwerke-heilbronn.de/index/hsw/Wasserh%C3%A4rte.html
* Stadtwerke Neckarsulm: http://www.sw-neckarsulm.de/main/produkte/trinkwasser/wasseranalyse.html
