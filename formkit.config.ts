import { generateClasses } from "@formkit/themes";

const config = {
  config: {
    classes: generateClasses({
      global: {
        label: " block mb-1 font-black text-lg",
        message: "text-red-500 mb-5",
        wrapper: "space-y-2 mb-3",
        input: "border border-gray-300 rounded p-3 w-full text-gray-700 placeholder-gray-400",
      },
      file: {
        noFiles: "block my-2",
        fileItem: " hidden",
      },
      select: {},
      // submit: {
      //   input: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out",

      // },
    }),
  },
};

export default config;
