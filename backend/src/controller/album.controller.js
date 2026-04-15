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

		let album = await Album.findById(albumId).populate("songs");

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		if (!album.songs || album.songs.length === 0) {
			const songs = await Song.find({ albumId }).sort({ createdAt: 1 });
			album = album.toObject();
			album.songs = songs;
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
