const Area = require('@models/area')

const createArea = async (areaData) => {
    const area = new Area(areaData);
    return await area.save()
}

const findAreaById = async (id) => {
    return Area.findById(id)
}

const updateAreaById = async (id, updateData) => {
    return Area.findByIdAndUpdate(id, updateData, {new: true, runValidators: true})
}

const deleteAreaById = async (id) => {
    return Area.findByIdAndDelete(id)
}

const getAllAreas = async (limit, offset) => {
    return Area.find().skip(offset).limit(limit)
}

const findAreaByName = async (name) => {
    return Area.findOne({name: name})
}

module.exports = {
    createArea,
    findAreaById,
    updateAreaById,
    deleteAreaById,
    getAllAreas,
    findAreaByName
}