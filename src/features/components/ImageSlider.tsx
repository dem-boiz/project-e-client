import { CardMedia, Container } from '@mui/material';
import React from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide, type SwiperSlideProps } from 'swiper/react';
import type { SwiperOptions } from 'swiper/types';


import mrKirk from '../../../mr-kirk.jpg';

interface ImageSliderProps {
    // Define your props here
    images: string[];
    loading?: boolean;
    error?: string;
    SwiperOptions?: SwiperOptions;
    SwiperSlideOptions?: SwiperSlideProps;
    onSlideClick?: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
    images, SwiperOptions, SwiperSlideOptions, onSlideClick 
}) => {

    return (
        <Container sx={{
            backgroundColor: 'red',
        }}>
            <Swiper
                key={images?.length}
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                style={{ width: "100%", height: 400 }}
                {...SwiperOptions}
            >
                {(images ?? []).map((_url, index) => (
                <SwiperSlide key={index} {...SwiperSlideOptions}>
                    <CardMedia
                        onClick={() => onSlideClick?.(index)}
                        component="img"
                        image={images[index] || mrKirk}
                        alt={`Image ${index + 1}`}
                        sx={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover",
                            cursor: "pointer"
                        }}
                    />
                </SwiperSlide>
                ))}
            </Swiper>
        </Container>

    );
};

export default ImageSlider;