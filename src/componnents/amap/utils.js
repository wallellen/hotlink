import { PermissionsAndroid } from "react-native";

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "申请定位权限",
        message: "定位.",
        buttonNeutral: "稍后",
        buttonNegative: "取消",
        buttonPositive: "确定"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.ACCESS_COARSE_LOCATION) {
      //console.log("You can use the camera");
    } else {
      //console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}
