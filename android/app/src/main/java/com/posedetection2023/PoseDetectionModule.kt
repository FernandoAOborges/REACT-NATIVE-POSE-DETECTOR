package com.posedetection2023

import android.graphics.PointF
import android.net.Uri
import android.util.Log
import com.facebook.react.bridge.*
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.common.PointF3D
import com.google.mlkit.vision.pose.Pose
import com.google.mlkit.vision.pose.PoseDetection
import com.google.mlkit.vision.pose.PoseLandmark
import com.google.mlkit.vision.pose.accurate.AccuratePoseDetectorOptions

import java.io.IOException
import kotlin.math.atan2

class PoseDetectionModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    override fun getName(): String {
        return "PoseDetectionModule"
    }

    private fun getRectMap(rect: PointF3D, type: Int, position: PointF): WritableMap {
        val rectObject = Arguments.createMap()
        rectObject.putDouble("x", rect.x.toDouble())
        rectObject.putDouble("y", rect.y.toDouble())
        rectObject.putDouble("z", rect.z.toDouble())
        rectObject.putInt("valor", type)

        // O resto da lógica ...

        return rectObject
    }

    private fun getData(rect: PointF3D, type: Int, name: String): WritableMap {
        val rectObject = Arguments.createMap()
        rectObject.putDouble("x", rect.x.toDouble())
        rectObject.putDouble("y", rect.y.toDouble())
        rectObject.putDouble("z", rect.z.toDouble())
        rectObject.putInt("valor", type)
        rectObject.putString("tipo", name)

        return rectObject
    }

//    private fun getAngle(firstPoint: PoseLandmark, midPoint: PoseLandmark, lastPoint: PoseLandmark): Double {
//        var result = toDegrees(
//            atan2(
//                lastPoint.position.y - midPoint.position.y,
//                lastPoint.position.x - midPoint.position.x
//            ) - atan2(
//                firstPoint.position.y - midPoint.position.y,
//                firstPoint.position.x - midPoint.position.x
//            )
//        )
//        result = Math.abs(result)
//        if (result > 180) {
//            result = 360.0 - result
//        }
//        return result
//    }

    @ReactMethod
    fun recognizeImage(url: String, promise: Promise) {
        try {
//            Log.d("url", "DA IMAGEM: $url")
            val uri = Uri.parse(url)
            val options = AccuratePoseDetectorOptions.Builder()
                .setDetectorMode(AccuratePoseDetectorOptions.SINGLE_IMAGE_MODE)
                .build()

            val poseDetector = PoseDetection.getClient(options)


            val   image = InputImage.fromFilePath(reactApplicationContext, uri)


            poseDetector.process(image)
                .addOnSuccessListener { result ->
                    val allPoseLandmarks = result.getAllPoseLandmarks()

                    val response = Arguments.createMap()
                    response.putInt("width", image.width)
                    response.putInt("height", image.height)

                    val lines = Arguments.createArray()

                    for (landmark in allPoseLandmarks) {
                        val blockObject = Arguments.createMap()
                        blockObject.putMap(
                            "position",
                            getRectMap(
                                landmark.position3D,
                                landmark.landmarkType,
                                landmark.position
                            )
                        )
                        lines.pushMap(blockObject)
                    }

                    response.putArray("blocks", lines)

// Exemplos de extração de pontos específicos
                    val nose = result.getPoseLandmark(PoseLandmark.NOSE)
                    val noseData = nose?.let { getData(it.position3D, nose.landmarkType, "Nariz") }
                    response.putMap("Nose", noseData)

                    val leftShoulder = result.getPoseLandmark(PoseLandmark.LEFT_SHOULDER)
                    val leftShoulderData = leftShoulder?.let {
                        getData(
                            it.position3D,
                            leftShoulder.landmarkType,
                            "Ombro Esquerdo"
                        )
                    }
                    response.putMap("LeftShoulder", leftShoulderData)

                    val rightShoulder = result.getPoseLandmark(PoseLandmark.RIGHT_SHOULDER)
                    val rightShoulderData = rightShoulder?.let {
                        getData(
                            it.position3D,
                            rightShoulder.landmarkType,
                            "Ombro Direito"
                        )
                    }
                    response.putMap("RightShoulder", rightShoulderData)

                    val leftElbow = result.getPoseLandmark(PoseLandmark.LEFT_ELBOW)
                    val leftElbowData =
                        leftElbow?.let { getData(leftElbow.position3D, it.landmarkType, "Cotovelo Esquerdo") }
                    response.putMap("LeftElbow", leftElbowData)

                    val rightElbow = result.getPoseLandmark(PoseLandmark.RIGHT_ELBOW)
                    val rightElbowData =
                        rightElbow?.let { getData(rightElbow.position3D, it.landmarkType, "Cotovelo Direito") }
                    response.putMap("RightElbow", rightElbowData)

                    val leftWrist = result.getPoseLandmark(PoseLandmark.LEFT_WRIST)
                    val leftWristData =
                        leftWrist?.let { getData(it.position3D, leftWrist.landmarkType, "Pulso Esquerdo") }
                    response.putMap("LeftWrist", leftWristData)

                    val rightWrist = result.getPoseLandmark(PoseLandmark.RIGHT_WRIST)
                    val rightWristData =
                        rightWrist?.let { getData(it.position3D, rightWrist.landmarkType, "Pulso Direito") }
                    response.putMap("RightWrist", rightWristData)

                    val leftHip = result.getPoseLandmark(PoseLandmark.LEFT_HIP)
                    val leftHipData =
                        leftHip?.let { getData(it.position3D, leftHip.landmarkType, "Quadril Esquerdo") }
                    response.putMap("LeftHip", leftHipData)

                    val rightHip = result.getPoseLandmark(PoseLandmark.RIGHT_HIP)
                    val rightHipData =
                        rightHip?.let { getData(it.position3D, rightHip.landmarkType, "Quadril Direito") }
                    response.putMap("RightHip", rightHipData)

                    val leftKnee = result.getPoseLandmark(PoseLandmark.LEFT_KNEE)
                    val leftKneeData =
                        leftKnee?.let { getData(it.position3D, leftKnee.landmarkType, "Joelho Esquerdo") }
                    response.putMap("LeftKnee", leftKneeData)

                    val rightKnee = result.getPoseLandmark(PoseLandmark.RIGHT_KNEE)
                    val rightKneeData =
                        rightKnee?.let { getData(it.position3D, rightKnee.landmarkType, "Joelho Direito") }
                    response.putMap("RightKnee", rightKneeData)

                    val leftAnkle = result.getPoseLandmark(PoseLandmark.LEFT_ANKLE)
                    val leftAnkleData =
                        leftAnkle?.let { getData(it.position3D, leftAnkle.landmarkType, "Tornozelo Esquerdo") }
                    response.putMap("LeftAnkle", leftAnkleData)

                    val rightAnkle = result.getPoseLandmark(PoseLandmark.RIGHT_ANKLE)
                    val rightAnkleData =
                        rightAnkle?.let { getData(it.position3D, rightAnkle.landmarkType, "Tornozelo Direito") }
                    response.putMap("RightAnkle", rightAnkleData)


// Continuar para outros marcos de pose ...

//                    val rightHipAngle = getAngle(
//                        result.getPoseLandmark(PoseLandmark.RIGHT_SHOULDER),
//                        result.getPoseLandmark(PoseLandmark.RIGHT_HIP),
//                        result.getPoseLandmark(PoseLandmark.RIGHT_KNEE)
//                    )
//
//                    Log.d("Angulo", "Quadril Direito: $rightHipAngle")

                    promise.resolve(response)
                }
                .addOnFailureListener { e ->
                    promise.reject("Falha reconhecimento pose", e)
                }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
}
