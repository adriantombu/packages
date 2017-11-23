# Récupération et vérification d'un numéro de TVA français
Cette librairie permet de générer un numéro de TVA à partir d'un SIREN ou d'un SIRET et de le vérifier ensuite via le service de validation de l'Union Européenne (VIES).

**Important :** cette librairie ne fonctionne actuellement que pour la France

Vous pouvez installer la librairie avec un `yarn add @adriantombu/vat-number`

## Convertir un SIREN ou SIRET
```
const {convertToVatNumber} = require('@adriantombu/vat-number')

const siren = 817871668
const vat = convertToVatNumber(817871668)

"FR16817871668"
```

## Vérifier un numéro de TVA
```
const {checkVatNumber} = require('@adriantombu/vat-number')

const vatNumber = 'FR16817871668';
const checkedVat = await checkVatNumber(vatNumber)

{
  country: 'FR',
  vatNumber: '16817871668',
  fullVatNumber: 'FR16817871668',
  name: 'SASU OTSO',
  address: 'CS 21531\n59 ALL JEAN JAURES\n31000 TOULOUSE',
}
```

## Comment modifier cette librairie
* Cloner le dépôt
* Installer les packages avec un petit `yarn`
* Modifier le fichier `src/index.js`
* Faire un petit coup de linting avec `yarn lint`
* Compiler avec la commande `yarn build`
* Tadaa !

### TODO
* Meilleure gestion des erreurs
* Ajouter des tests
* Ajouter de nouveaux pays
* Some English too
