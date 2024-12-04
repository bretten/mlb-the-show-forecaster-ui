# Further Documentation
Please see the [wiki](https://github.com/bretten/mlb-the-show-forecaster-ui/wiki).

# What is it?

The UI for https://github.com/bretten/mlb-the-show-forecaster

---

# Which technologies?
It is built with:
 - React + Vite
 - [MUI component lib](https://mui.com/)

## How is it deployed?
This is the front-end for an ASP.NET Core application and in `production` mode, that app will simply load the static React build files. This is because `production` mode denies `CORS`. In `dev` mode, the React app runs on its development server from a separate URL, so the ASP.NET Core allows `CORS` requests.

---

# How can I run it (in dev mode)?

First, copy `.env.example` to `.env`. If you are running against the `dev` ASP.NET Core app, remove the `/api` prefix from any URI in the `.env.example` file. You must also set the base URL environment variable, `VITE_BASE_URL`, to the currently running ASP.NET Core URL, which by default is: `https://localhost:5000`.

Then, from the root dir:
```shell
npm run dev
```

## How do I generate the build files?
From the root dir:
```shell
npm run build
```

## How do I run the tests?
From the root dir:
```shell
npm run test
```