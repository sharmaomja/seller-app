import React, { useState } from 'react';

const ImagesAndVideos = () => {
  const [imageURLs, setImageURLs] = useState([]);
  const [videoURLs, setVideoURLs] = useState([]);

  const handleImageChange = (index, e) => {
    const newURLs = [...imageURLs];
    newURLs[index] = e.target.value;
    setImageURLs(newURLs);
  };

  const handleVideoChange = (index, e) => {
    const newURLs = [...videoURLs];
    newURLs[index] = e.target.value;
    setVideoURLs(newURLs);
  };

  const addURLField = (type) => {
    if (type === 'image') {
      setImageURLs([...imageURLs, '']);
    } else if (type === 'video') {
      setVideoURLs([...videoURLs, '']);
    }
  };

  return (
    <div className='flex'>
      <div className='w-1/2 pr-4'>
        <div className="form-group">
          <label className="block text-gray-700 text-sm font-bold mb-2">Product Images:</label>
          {imageURLs.map((url, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter image URL"
                value={url}
                onChange={(e) => handleImageChange(index, e)}
              />
            </div>
          ))}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => addURLField('image')}
          >
            + Add Image URL
          </button>
        </div>
      </div>
      <div className='w-1/2'>
        <div className="form-group">
          <label className="block text-gray-700 text-sm font-bold mb-2">Product Videos:</label>
          {videoURLs.map((url, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter video URL"
                value={url}
                onChange={(e) => handleVideoChange(index, e)}
              />
            </div>
          ))}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => addURLField('video')}
          >
            + Add Video URL
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagesAndVideos;
