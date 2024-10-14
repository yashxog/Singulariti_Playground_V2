/* eslint-disable @next/next/no-img-element */
import { ImagesIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './mainPage';

type Image = {
  url: string;
  img_src: string;
  title: string;
};

export const ImageResults = ({
  query,
  chat_history,
}: {
  query: string;
  chat_history: Message[];
}) => {
  const [images, setImages] = useState<Image[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  return (
    <div className="w-full pl-4">
      {!loading && images === null && (
        <button
        onClick={async () => {
          setLoading(true);

          const chatModelProvider = localStorage.getItem('chatModelProvider');
          const chatModel = localStorage.getItem('chatModel');
          const res = await fetch(
            `${"http://localhost:8200/singulariti"}/images`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: query,
                chat_history: chat_history,
                chat_model_provider: chatModelProvider,
                chat_model: chatModel,
              }),
            },
          );

          const data = await res.json();

          const images = data.images;
          setImages(images);
          setSlides(
            images.map((image: Image) => {
              return {
                src: image.img_src,
              };
            }),
          );
          setLoading(false);
        }}
          className="w-full border border-dashed border-borderColour1 dark:border-borderColour1 hover:bg-custom-bg-2 dark:hover:bg-custom-bg-2 active:scale-95 duration-200 transition px-4 py-2 flex flex-row items-center justify-between rounded-lg text-gray-700 dark:text-white text-sm"
        >
          <div className="flex flex-row items-center space-x-2">
            <ImagesIcon size={17} />
            <p>Search images</p>
          </div>
          <PlusIcon className="text-white" size={17} />
        </button>
      )}
      {loading && (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 h-24 w-full rounded-lg animate-pulse aspect-video"
            />
          ))}
        </div>
      )}
      {images !== null && images?.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {images.length > 4
              ? images.slice(0, 3).map((image, i) => (
                  <img
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-24 w-full aspect-video object-cover rounded-lg transition duration-200 active:scale-95 hover:scale-[1.02] cursor-zoom-in"
                  />
                ))
              : images.map((image, i) => (
                  <img
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-24 w-full aspect-video object-cover rounded-lg transition duration-200 active:scale-95 hover:scale-[1.02] cursor-zoom-in"
                  />
                ))}
            {images.length > 4 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-custom-bg-1 hover:bg-custom-bg-2 dark:bg-custom-bg-1 dark:hover:bg-custom-bg-2 transition duration-200 active:scale-95 hover:scale-[1.02] h-24 w-full rounded-lg flex flex-col justify-between text-gray-700 dark:text-gray-300 p-2"
              >
                <div className="flex flex-row items-center space-x-1">
                  {images.slice(3, 6).map((image, i) => (
                    <img
                      key={i}
                      src={image.img_src}
                      alt={image.title}
                      className="h-4 w-8 rounded-sm aspect-video object-cover"
                    />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  View {images.length - 3} more
                </p>
              </button>
            )}
          </div>
          <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
        </>
      )}
    </div>
  );
};