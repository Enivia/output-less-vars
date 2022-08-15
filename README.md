# output-less-vars

Read LESS variables and return them as json.

Example:

```less
@color: #000;
@height: 100px;
```

Output:

```json
{ "color": "#000", "height": "100px" }
```

## Installation

```
yarn add output-less-vars
```

## Usage

### cmd

```shell
output-less-vars --less='./styles.less' --json='./vars.json'
```

### script

```js
const outputLessVars = require("output-less-vars");
outputLessVars({ less: "./styles.less", vars: "./vars.json" }, (content) => console.log(content));
```

## Option

| Name | Description           | Required |
| ---- | --------------------- | -------- |
| less | less file path        | true     |
| json | output json file path | false    |
