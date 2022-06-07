## Guidelines

- Create small modules that export an async function and adhere to the pattern seen.
- Aim for an an easy-to-understand declarative usage style.
- Export any new check functions through the index so that they are easy to access.
- Try not to use one check function from within another, instead extract common functions outside of this directory and require it in whichever check function in which the functionality is needed.
