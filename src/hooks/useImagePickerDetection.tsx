import { useState, useCallback } from 'react';
import { NativeModules } from 'react-native';
import { launchImageLibrary, ErrorCode, Asset } from 'react-native-image-picker';

import { IResultPosesProps } from '@/types/Types';

type TErrorCodeProps = ErrorCode | null;
type TImageResponseProps = Asset | null;
type TResultPosesProps = IResultPosesProps | null;

const useImagePickerDetection = () => {
  const [image, setImage] = useState<TImageResponseProps>(null);
  const [error, setError] = useState<TErrorCodeProps>(null);
  const [resultPoses, setResultPoses] = useState<TResultPosesProps>(null);
  const [aspectRatioImage, setAspectRatioImage] = useState(1);

  const { PoseDetectionModule } = NativeModules;

  const handleLaunchImageLibrary = useCallback(async () => {
    try {
      const response = await launchImageLibrary({ mediaType: 'photo' });

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        setError(response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
        const result = await PoseDetectionModule.recognizeImage(response.assets[0].uri);

        setResultPoses(result);
        setAspectRatioImage(result.height / result.width);
      }
    } catch (err) {
      setError(err as ErrorCode);
    }
  }, [PoseDetectionModule]);

  return { image, error, handleLaunchImageLibrary, resultPoses, aspectRatioImage };
};

export default useImagePickerDetection;
