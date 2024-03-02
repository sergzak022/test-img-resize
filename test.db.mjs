import { connect, addImage, updateImage, listImages } from './db.mjs';

await connect();

async function main() {
//    await connect();

    // Add a new image
//    const id = await addImage({ imageName: 'example.jpg', status: 'pending'});

    // Update an existing image
 //   await updateImage(id, { status: 'completed', processedImageName: 'example_resized.jpg' });

    // List all images
    const images = await listImages();
    console.log(images);
}

main().catch(console.error);
