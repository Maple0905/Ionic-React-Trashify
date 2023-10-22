import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export interface userPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {

  const takePhoto = async() => {
    const photo =await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
  };

  return {
    takePhoto,
  }
}
