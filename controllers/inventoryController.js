const Material = require('../models/Material');

const getMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addMaterial = async (req, res) => {
    try {
        const material = await Material.create(req.body);
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await Material.findByIdAndDelete(id);
        res.status(200).json({ message: 'Material deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getMaterials, addMaterial, updateMaterial, deleteMaterial };
