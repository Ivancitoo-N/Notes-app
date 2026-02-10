import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "NotasApp",
        short_name: "NotasApp",
        description: "Una aplicación de notas limpia y eficiente",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
            {
                src: "/icon.png",
                sizes: "1024x1024",
                type: "image/png"
            }
        ]
    }
}
