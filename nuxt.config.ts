// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ["@nuxtjs/tailwindcss", "nuxt-vuetify", "@nuxt/image"],
    ssr: false,
    /* have favicon and mobile web app capable and title App4Juh*/
    head: {
        title: "App4JUH",
        meta: [
            {charset: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"},
            {hid: "description", name: "description", content: "Apps für die Erste Hilfe Kurse der JUH"},
        ],
        link: [{rel: "icon", type: "image/x-icon", href: "/image/app4juh.jpg"}],
    },


})
