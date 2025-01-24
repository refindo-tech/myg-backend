const { query } = require('express');
const { database } = require('../../../helpers/config/db');

class AdminTrainingServices {
    createTraining = async (req) => {
        try {
            const createEvent = await database.training.create({
                data: {
                    trainingName: req.body.title,
                    description: req.body.description,
                    dateStart: new Date(req.body.dateStart),
                    address: req.body.address,
                    price: parseInt(req.body.price),
                    uploadedBy: parseInt(req.user.id),
                    embedMaps: req.body.embedMaps,
                    materi: req.body.materi,
                    benefit: req.body.benefit,
                    linkMaps: req.body.linkMaps,
                }
            })
            if (createEvent) {
                const createMaterial = await database.material.create({
                    data: {
                        trainingId: parseInt(createEvent.trainingId),
                        title: req.body.title,
                        description: req.body.description,
                        type: req.body.type ? req.body.type : "OFFLINE",
                        membershipLevel: req.body.membershipLevel ? req.body.membershipLevel : "FREE",
                        banner: req.file?.path || "",
                        brosur: req.file?.path || null,
                        ebook: req.body.ebook || null,
                        youtubeVideo: req.body.youtubeVideo || null,
                        uploadedBy: parseInt(req.user.id)
                    }
                })
                if (createMaterial) {
                    return createMaterial
                }
            }
        } catch (error) {
            console.error(error)
            return {
                status: false,
                message: "Internal Server Error"
            }
        }
    }
    listTraining = async (req) => {
        try {
            console.log(req.query)
            const { page, limit, search } = req.query
            const count = await database.training.count()
                // {
                //     where:req.query.search ? {trainingName:{contains:req.query.search, mode:"insensitive"}} : undefined,
                // }
            const config = () => {
                const where = { trainingName: { contains: search } }
                const orderBy = { dateStart: 'desc' }
                const include = { materials: true }
                const skip = parseInt(page) === 1 ? 0 : parseInt(page)
                const take = parseInt(limit)
                if (search) {
                    return {
                        where: where,
                        orderBy: orderBy,
                        include:include,
                        skip:skip,
                        take:take
                    }
                }
                return {
                    orderBy: orderBy,
                    include:include,
                    skip:skip,
                    take:take
                }
                // return{
                //     orderBy: {
                //         dateStart: 'desc'
                //     },
                //     include: {
                //         materials: true
                //     },
                //     skip: parseInt(page) === 1 ? 0 : parseInt(page),
                //     take: parseInt(limit)
                // }
            }
            console.log(config())
            // req.query.search ? {trainingName:{contains:req.query.search, mode:"insensitive"}} : 
            const list = await database.training.findMany(
                // {
                //     where:{trainingName:{contains:req.query.search}},
                //     orderBy: {
                //         dateStart: 'desc'
                //     },
                //     include: {
                //         materials: true
                //     },
                //     skip: parseInt(page) === 1 ? 0 : parseInt(page),
                //     take: parseInt(limit),
                // }
                config()
            )
            if (list) {
                const result = { list, count }
                return result
            }
        } catch (error) {
            console.log(error)
        }
    }
    detailTraining = async (req) => {
        try {
            const detail = await database.training.findUnique({
                where: {
                    trainingId: parseInt(req.params.trainingId)
                },
                include: {
                    materials: true
                }
            })
            if (detail) {
                return detail
            }
        } catch (error) {
            console.error(error)
            return {
                status: false,
                message: "Internal Server Error"
            }
        }
    }
    updateTraining = async (req) => {
        try {
            const findTraining = await database.training.findUnique({
                where: { trainingId: parseInt(req.params.trainingId) },
                include: { materials: true }
            })
            if (!findTraining) {
                return {
                    status: false,
                    message: "Event Not Found"
                }
            } else {
                const update = await database.training.update({
                    where: {
                        trainingId: parseInt(req.params.trainingId)
                    },
                    data: {
                        trainingName: req.body.title,
                        description: req.body.description,
                        dateStart: new Date(req.body.dateStart),
                        address: req.body.address,
                        price: parseInt(req.body.price),
                        uploadedBy: parseInt(req.user.id),
                        embedMaps: req.body.embedMaps,
                        linkMaps: req.body.linkMaps,
                        materi: req.body.materi,
                        benefit: req.body.benefit,
                        materials: {
                            update: {
                                where: {
                                    materialId: findTraining.materials[0].materialId, // Identifikasi data berdasarkan ID atau properti unik lainnya
                                },
                                data: {
                                    title: req.body.title,
                                    description: req.body.description,
                                    type: req.body.type ? req.body.type : "OFFLINE",
                                    membershipLevel: req.body.membershipLevel ? req.body.membershipLevel : "FREE",
                                    banner: req.file?.path || "",
                                    brosur: req.file?.path || null,
                                    ebook: req.body.ebook || null,
                                    youtubeVideo: req.body.youtubeVideo || null,
                                    uploadedBy: parseInt(req.user.id)
                                }
                            }
                        }
                    }
                })
                if (update) {
                    return update
                }
            }
        } catch (error) {
            console.error(error)
            return {
                status: false,
                message: "Internal Server Error"
            }
        }
    }
    deleteTraining = async (req) => {
        try {
            const deleted = await database.training.delete({
                where: {
                    trainingId: parseInt(req.params.trainingId)
                }
            })
            if (deleted) {
                return deleted
            }
        } catch (error) {
            console.error(error)
            return {
                status: false,
                message: "Internal Server Error"
            }
        }
    }
}
module.exports = new AdminTrainingServices();