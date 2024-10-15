<script setup lang="ts">
import { ref as refVue } from "vue";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, writeBatch, doc } from "firebase/firestore";
import { useFirebaseStorage, useFirestore } from "vuefire";
import { products } from "@/data/products";
import showToastNotification from "@/services/notifications";
import LinkView from "@/components/Ui/LinkView.vue";

const storage = useFirebaseStorage();
const db = useFirestore();
const progressUpload = refVue(0);
const filNameUpload = refVue("");

async function seedDB() {
  const productsCollection = collection(db, "products");
  const batch = writeBatch(db);

  try {
    await Promise.all(
      products.map(async (product, index) => {
        const url = await getDownloadURL(
          ref(storage, `products/producto${index + 1}.jpg`)
        );
        const docRef = doc(productsCollection);
        batch.set(docRef, {
          name: product.name,
          price: product.price,
          stock: product.quantity,
          category: product.category,
          image: url,
        });
      })
    );

    await batch.commit();
    showToastNotification("Todos los productos agregados correctamente", true);
  } catch (error) {
    showToastNotification("Error al agregar los productos", false);
  }
}

const handleSubmit = (data: { images: any[] }) => {
  const urls: string[] = [];
  data.images.forEach((fileItem: any) => {
    const storageRef = ref(storage, "/products");

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytesResumable(
      ref(storageRef, fileItem.name),
      fileItem.file
    );

    // Monitor the upload progress and retrieve the download URL
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Upload progress can be monitored here
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressUpload.value = progress;
        filNameUpload.value = fileItem.name;
      },
      (_) => {
        showToastNotification("Error al subir la imagen", false);
      },
      () => {
        // Upload is complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          urls.push(downloadURL);
          if (urls.length === data.images.length) {
            showToastNotification("Imágenes agregadas correctamente", true);
          }
        });
      }
    );
  });
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <nav class="mb-4">
      <LinkView
        to="Products"
        class="text-blue-600 hover:text-blue-800 inline-block"
      >
        ← Volver
      </LinkView>
    </nav>

    <h1 class="text-4xl font-extrabold text-center mb-3 text-gray-800">
      Seeder
    </h1>
    <span
      v-if="progressUpload > 0"
      class="block text-center text-gray-600 mb-8"
    >
      Subiendo {{ filNameUpload }}: {{ progressUpload }}%
    </span>

    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-8">
        <FormKit
          type="form"
          submit-label="Agregar Imágenes"
          :submit-attrs="{
            inputClass:
              'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300',
          }"
          incomplete-message="No se pudo enviar, revisa los mensajes"
          @submit="handleSubmit"
        >
          <FormKit
            type="file"
            multiple="true"
            name="images"
            label="Seleccionar imágenes"
            help="Selecciona una o más imágenes para subir"
            validation="required"
            :validation-messages="{
              required: 'Por favor, selecciona al menos una imagen',
            }"
          />
        </FormKit>

        <div class="mt-12 pt-8 border-t border-gray-200">
          <FormKit
            type="form"
            submit-label="Agregar Productos"
            :submit-attrs="{
              inputClass:
                'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300',
            }"
            incomplete-message="No se pudo enviar, revisa los mensajes"
            @submit="seedDB"
          >
            <!-- Add your product form fields here -->
          </FormKit>
        </div>
      </div>
    </div>
  </div>
</template>
