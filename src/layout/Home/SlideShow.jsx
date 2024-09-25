import { Box, IconButton, Typography, Container } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useState } from 'react';

const slides = [
    {
        title: 'Slide 1',
        content: 'This is the first slide.',
        imgSrc: 'https://bizweb.dktcdn.net/100/363/348/themes/731970/assets/slide-img1.jpg?1725286589169'
    },
    {
        title: 'Slide 2',
        content: 'This is the second slide.',
        imgSrc: 'https://bizweb.dktcdn.net/100/363/348/themes/731970/assets/slide-img2.jpg?1725286589169'
    },
    {
        title: 'Slide 3',
        content: 'This is the third slide.',
        imgSrc: 'https://via.placeholder.com/600x300?text=Slide+3'
    }
];

const SlideShow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + slides.length) % slides.length
        );
    };

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <img
                    src={slides[currentIndex].imgSrc}
                    alt={slides[currentIndex].title}
                    style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '8px' }}
                />
                <Typography variant="h4" component="div" gutterBottom sx={{ mt: 2 }}>
                    {slides[currentIndex].title}
                </Typography>
                <Typography variant="body1" component="div" gutterBottom>
                    {slides[currentIndex].content}
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                    <IconButton onClick={prevSlide}>
                        <ArrowBack />
                    </IconButton>
                    <IconButton onClick={nextSlide}>
                        <ArrowForward />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default SlideShow;
