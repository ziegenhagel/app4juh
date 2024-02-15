// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/tailwindcss",
        "nuxt-vuetify",
        "@nuxt/image",
        // "@nuxtjs/supabase",
        "nuxt-appwrite"
    ],
    appwrite: {
        endpoint: 'https://cloud.appwrite.io/v1',
        project: '65ba5911b0a714ddaadf',
    },
    ssr: false,
    /* have favicon and mobile web app capable and title App4Juh*/
    head: {
        title: "Apps",
        meta: [
            {charset: "utf-8"},
            {name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"},
            {hid: "description", name: "description", content: "Apps für die Erste Hilfe Kurse der JUH"},
            // full web app ios and android
            {name: "mobile-web-app-capable", content: "yes"},
            {name: "apple-mobile-web-app-capable", content: "yes"},
            {name: "apple-mobile-web-app-status-bar-style", content: "black"},
            {name: "apple-mobile-web-app-title", content: "App4Juh"},
            // favicon
            {name: "msapplication-TileImage", content: "/image/app4juh.jpg"},


        ],
        link: [{rel: "icon", type: "image/x-icon", href: "/image/app4juh.jpg"}],
    },

    imports: {
        presets: [{
            // run yarn add sweetalert2
            from: 'sweetalert2',
            imports: [{name: 'default', as: 'Swal'}],
        }]
    },
})
