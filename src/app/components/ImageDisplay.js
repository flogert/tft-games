export default function ImageDisplay({ src, alt }) {
    return (
      <div className="flex justify-center items-center my-6">
        <img
          src={src}
          alt={alt}
          className="w-64 h-64 object-contain border-4 border-gray-200 rounded-lg shadow-lg"
        />
      </div>
    );
  }