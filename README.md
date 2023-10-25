# Otto BackOffice Website

## Git Branching Model

This project uses the [Parallel Develop and Master][1] branching model.  
Features get to the `master` only through acceptance on `develop`.

## Development

### npm start

runs the development server at `http://localhost:4200/`

### npm test[:(watch|tdd)]

executes the unit tests via [Jest][2]

### npm run build[:(prod|staging|dev)]

verifies that the project can be bundled successfully

### npm run lint[:(fix|scss)]

runs the ng and scss linters

[1]: https://myndmanagement.atlassian.net/wiki/spaces/ENG/pages/504005054/Git+Branching+Models#%E2%80%9CParallel-Develop-And-Master%E2%80%9D-Model
[2]: https://jestjs.io/en/
