# Devtoberfest 2024 Badge Checker

This Bash script fetches and validates Devtoberfest 2024 badges 

To use the Node.js version of the Devtoberfest Badges Checker, follow the instructions below:

### Prerequisites

- Node.js and npm installed on your system. If not, download and install them from [nodejs.org](https://nodejs.org/).

### Installation

In your project directory, install the required dependencies using the following command:

```sh
npm install 
```

### Usage

To execute the Node.js script, use the following command in your terminal, replacing `<scnId>` with the SCN ID you want to check:

```sh
node index.js -u <scnId>
```

If you only want to display those badges that were not found, add the -n or --notFound flag:

```sh
node index.js -u <scnId> -n
```

For example:

```sh
node index.js -u mariannnn -n
```

### Output

The script will compare the badges from the SAP People API against the badges listed in the JSON file and will display a list of badges with a "✅" symbol for earned badges and a "❌" symbol for unearned badges.

Example output:

```sh
✅ #E3CF57 - Devtoberfest 2023 - Petoberfest
❌ #CD9B1D - Devtoberfest 2023 - Making SAP Extensibility real with CAP in 60 minutes
✅ #D2691E - Devtoberfest 2023 - Capire: Introduction, enhancements, and facilitating the development process
```
