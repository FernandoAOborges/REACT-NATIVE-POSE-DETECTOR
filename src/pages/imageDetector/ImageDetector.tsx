import React, { useMemo } from 'react';
import { Button, Image, useWindowDimensions, Text, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { useImagePickerDetection } from '@/hooks';
import { TPosePointProps } from '@/types/Types';

const leftSideSequence = [
  11, // Ombro Esquerdo
  13, // Cotovelo Esquerdo
  15, // Pulso Esquerdo
  21, // dedo da mão Esquerda
  23, // Quadril Esquerdo
  25, // Joelho Esquerdo
  27, // Tornozelo Esquerdo
  29, // Calcanhar Esquerdo
  31, // Dedo do pé Esquerdo
];

const rightSideSequence = [
  // Substitua os números pelos índices corretos dos pontos do lado direito
  12, // Ombro Direito
  14, // Cotovelo Direito
  16, // Pulso Direito
  22, // dedo da mão Direita
  24, // Quadril Direito
  26, // Joelho Direito
  28, // Tornozelo Direito
  30, // Calcanhar Direito
  32, // Dedo do pé Direito
  34, // Dedo do pé Direito
];

const ImageDetector = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { handleLaunchImageLibrary, image, error, resultPoses } = useImagePickerDetection();

  const imageDisplayHeight = useMemo(() => {
    const imageWidth = resultPoses?.width || 1;
    const imageHeight = resultPoses?.height || 1;
    return windowWidth * (imageHeight / imageWidth); // Calcula o height com base no aspect ratio
  }, [windowWidth, resultPoses]);

  const scaleFactor = useMemo(
    () => (resultPoses ? windowWidth / resultPoses.width : 1),
    [windowWidth, resultPoses],
  );

  const renderedPoints = useMemo(
    () =>
      resultPoses?.blocks.map((point) => {
        const posX = point.position.x * scaleFactor;
        const posY = point.position.y * scaleFactor;
        return (
          <Circle
            key={`point-${point.position.x}-${point.position.y}`}
            cx={posX}
            cy={posY}
            r={3}
            fill="yellow"
          />
        );
      }),
    [resultPoses?.blocks, scaleFactor],
  );

  const renderedLines = useMemo(() => {
    const lines: JSX.Element[] = [];

    // Função auxiliar para adicionar linha entre dois pontos
    const addLineBetweenPoints = (
      startPoint: TPosePointProps,
      endPoint: TPosePointProps,
      keySuffix: string,
    ) => {
      const startX = startPoint.position.x * scaleFactor;
      const startY = startPoint.position.y * scaleFactor;
      const endX = endPoint.position.x * scaleFactor;
      const endY = endPoint.position.y * scaleFactor;

      lines.push(
        <Line
          key={`line-${keySuffix}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="red"
          strokeWidth="2"
        />,
      );
    };

    // Desenhe as linhas para o lado esquerdo
    for (let i = 0; i < leftSideSequence.length - 1; i += 1) {
      const startPoint = resultPoses?.blocks[leftSideSequence[i]];
      const endPoint = resultPoses?.blocks[leftSideSequence[i + 1]];
      if (startPoint && endPoint) {
        addLineBetweenPoints(startPoint, endPoint, `left-${i}`);
      }
    }

    // Desenhe as linhas para o lado direito
    for (let i = 0; i < rightSideSequence.length - 1; i += 1) {
      const startPoint = resultPoses?.blocks[rightSideSequence[i]];
      const endPoint = resultPoses?.blocks[rightSideSequence[i + 1]];
      if (startPoint && endPoint) {
        addLineBetweenPoints(startPoint, endPoint, `right-${i}`);
      }
    }

    // Conecte os ombros
    const leftShoulder = resultPoses?.blocks[leftSideSequence[0]];
    const rightShoulder = resultPoses?.blocks[rightSideSequence[0]];
    if (leftShoulder && rightShoulder) {
      addLineBetweenPoints(leftShoulder, rightShoulder, 'shoulders');
    }

    return lines;
  }, [resultPoses?.blocks, scaleFactor]);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Abrir Galeria" onPress={handleLaunchImageLibrary} />
      {image?.uri && resultPoses && (
        <View>
          <Image
            source={{ uri: image.uri }}
            style={{
              width: windowWidth,
              height: imageDisplayHeight,
            }}
            resizeMode="contain"
          />
          <Svg
            height={imageDisplayHeight}
            width={windowWidth}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {renderedPoints}
            {renderedLines}
          </Svg>
        </View>
      )}

      {error && <Text>Erro: {error}</Text>}
    </View>
  );
};

export default ImageDetector;
