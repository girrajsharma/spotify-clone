import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find();
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		const album = await Album.findById(albumId);

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		const songs = await Song.find({ albumId: album._id }).sort({ createdAt: 1 });
		const albumObject = album.toObject();
		albumObject.songs = songs;

		res.status(200).json(albumObject);
	} catch (error) {
		next(error);
	}
};
