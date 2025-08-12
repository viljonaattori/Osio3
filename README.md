# Osio3

"Postman plugin" == REST client

tänne asennettiin CORS siinä vaiheessa kun frontendin urli ohjattiin tänne.

Linkki backendiin:
https://osio3.onrender.com

Render deActivoitu

sovelluksen local käynnistys: node --watch index.js

tuotantoversion tekeminen:

1. frontissa: npm run build
2. dist kopiointi back endiin komennolla:
   esim : cp -r dist/ "C:/Users/35844/OneDrive - Karelia Ammattikorkeakoulu Oy/FullstackKurssi/Osio3/Osio3/Osio3NoteBackend"

Tehtävä 3.21
Kaikki toimii localisti niinkuin pitää ja virheilmoitus tulostuu, mutta render ei jostain syystä lue uusinta committia ja täten käyttää vanhaa distiä. En tiedä mikä neuvoksi, kokeilin paljon asioita, mutta ainakaan tällä hetkellä uusinta versiota render ei pysty lukemaan.
