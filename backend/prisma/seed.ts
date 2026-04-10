import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import { seedAirports } from './seed-airport';
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    //Cargo al usuario superadminstrador
    console.log("Cargando usuario superadministrador")
    await cargarAdmin();

    //Cargo los aeropuertos
    console.log("Cargando aeropuertos")
    await seedAirports(prisma);

    console.log("Seed completado")
}

async function cargarAdmin(){
    try {
        const adminEmail = "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            throw new Error("ADMIN_PASSWORD environment variable is not set");
        }

        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        })

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10)

            await prisma.user.create({
            data: {
                name: "Admin",
                surname: "User",
                email: adminEmail,
                password: hashedPassword,
                createdAt: new Date(),
                role: Role.SUPERADMIN
            }
            })

            console.log("Admin user created")
        } else {
            console.log("Admin already exists, skipping")
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
        throw error;
    }
}



    main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })