import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function deleteAllData(orderedFileNames: string[]) {
    const modelNames = orderedFileNames.map((fileName) => {
        const modelName = path.basename(fileName, path.extname(fileName))
        return modelName.charAt(0).toUpperCase() + modelName.slice(1)
    })

    for (const modelName of modelNames) {
        const model: any = prisma[modelName as keyof typeof prisma]
        if (model) {
            await model.deleteMany({})
            console.log(`Cleared data from ${modelName}`)
        } else {
            console.error(
                `Model ${modelName} not found. Please ensure the model name is correctly specified.`,
            )
        }
    }
}

async function seedData(orderedFileNames: string[]) {
    const dataDirectory = path.join(__dirname, 'seedData')

    for (const fileName of orderedFileNames) {
        const filePath = path.join(dataDirectory, fileName)
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        const modelName = path.basename(fileName, path.extname(fileName))
        const model: any = prisma[modelName as keyof typeof prisma]

        if (!model) {
            console.error(`No Prisma model matches the file name: ${fileName}`)
            continue
        }

        for (const data of jsonData) {
            await model.create({
                data,
            })
        }

        console.log(`Seeded ${modelName} with data from ${fileName}`)
    }
}

async function main() {
    const deleteFileNames = [
        'sales.json',
        'purchases.json',
        'expenseByCategory.json',
        'expenseSummary.json',
        'expenses.json',
        'salesSummary.json',
        'purchaseSummary.json',
        'users.json',
        'products.json',
    ]

    const createFileNames = [
        'products.json',
        'expenseSummary.json',
        'sales.json',
        'salesSummary.json',
        'purchases.json',
        'purchaseSummary.json',
        'users.json',
        'expenses.json',
        'expenseByCategory.json',
    ]

    await deleteAllData(deleteFileNames)
    await seedData(createFileNames)
}

main()
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
