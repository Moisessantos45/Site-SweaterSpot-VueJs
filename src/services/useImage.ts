import { ref, computed } from "vue";
import { useFirebaseStorage } from "vuefire";
import {
  ref as firebaseStorageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { uid } from "uid";
import showToastNotification from "./notifications";

const useImage = () => {
  const storage = useFirebaseStorage();
  const url = ref<string>("");

  const onFileChange = (e: Event) => {
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (!file) return;
    const fileName = uid() + file?.type.replace("image/", ".");

    const isRef = firebaseStorageRef(storage, "products/" + fileName);

    const uploadTask = uploadBytesResumable(isRef, file);
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        const message = `Error: ${error.message}`;
        showToastNotification(message, false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          url.value = downloadURL;
          showToastNotification("Image uploaded successfully", true);
        });
      }
    );
  };

  const isImage = computed(() => {
    return url.value ? url.value : null;
  });

  return { url, onFileChange, isImage };
};

export default useImage;
