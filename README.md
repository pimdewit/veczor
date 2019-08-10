# Veczor
Little library that helps you do performant, abstract SVG animations

[DEMO](https://veczor.web.app) [DEMO](https://veczor.web.app) [DEMO](https://veczor.web.app)
[DOCS](https://pimdewit.github.io/veczor/) [DOCS](https://pimdewit.github.io/veczor/) [DOCS](https://pimdewit.github.io/veczor/)

[DEMO](https://veczor.web.app) [DEMO](https://veczor.web.app) [DEMO](https://veczor.web.app)
[DOCS](https://pimdewit.github.io/veczor/) [DOCS](https://pimdewit.github.io/veczor/) [DOCS](https://pimdewit.github.io/veczor/)


## Example visuals

![Veczor, by Pim de Wit](/.repository/veczor-by-pim_de_wit-1.svg)
![Veczor, by Pim de Wit](/.repository/veczor-by-pim_de_wit-2.svg)
![Veczor, by Pim de Wit](/.repository/veczor-by-pim_de_wit-3.svg)



## Example setup


```javascript
const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg"><g transform="translate(60 60)" stroke="#000" fill="none" fill-rule="evenodd"><circle cx="68" cy="68" r="68"/><circle cx="68" cy="68" r="64"/><circle cx="68" cy="68" r="60"/><circle cx="68" cy="68" r="56"/><circle cx="68" cy="68" r="52"/><circle cx="68" cy="68" r="48"/><circle cx="68" cy="68" r="44"/><circle cx="68" cy="68" r="40"/><circle cx="68" cy="68" r="36"/><circle cx="68" cy="68" r="32"/><circle cx="68" cy="68" r="28"/><circle cx="68" cy="68" r="24"/><circle cx="68" cy="68" r="20"/><circle cx="68" cy="68" r="16"/><circle cx="68" cy="68" r="12"/><circle cx="68" cy="68" r="8"/></g></svg>`

const veczor = new Veczor(myCanvas, mySVG);
veczor.dashGap = Math.random() * 10;
veczor.dashLength = Math.random() * 100;
veczor.color = '#f04';
veczor.fit();
veczor.center();

function loop() {
  veczor.velocity += 0.05;
  requestAnimationFrame(loop);
}

loop();
```
