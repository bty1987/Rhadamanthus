package com.fanglin.camera.provider.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.camera.po.ConstructionCameraPO;
import com.fanglin.camera.provider.CameraProviderService;
import com.fanglin.camera.vo.ConstructionCameraLiveVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.HttpUtil;
import com.fanglin.utils.SystemConfig;

@Service("ys7CameraProviderService")
public class Ys7CameraProviderServiceImpl implements CameraProviderService {

	private static final String CONFIG_HOST_STR = "YS7_OPEN_HOST_STR";

	private static final String CONFIG_APPKEY_STR = "YS7_APPKEY_STR";

	private static final String CONFIG_APPSECRET_STR = "YS7_APPSECRET_STR";

	private static final String DEFAULT_HOST_STR = "https://open.ys7.com";

	private static final String CODE_SUCCESS_STR = "200";

	private static final String PROTOCOL_HLS_STR = "2";

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public ConstructionCameraLiveVO queryLiveUrl(ConstructionCameraPO cameraPO, String protocol, int company) throws FLException {

		String accessToken = getAccessToken(company);

		List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
		params.add(new BasicNameValuePair("accessToken", accessToken));
		params.add(new BasicNameValuePair("deviceSerial", cameraPO.getDeviceSerial()));
		params.add(new BasicNameValuePair("channelNo", String.valueOf(cameraPO.getChannelNo())));
		params.add(new BasicNameValuePair("protocol", protocol == null || protocol.length() == 0 ? PROTOCOL_HLS_STR : protocol));
		params.add(new BasicNameValuePair("quality", "1"));
		params.add(new BasicNameValuePair("suportH265", "0"));

		JSONObject response = HttpUtil.httpPost(host(company) + "/api/lapp/v2/live/address/get", params);

		check(response);

		JSONObject data = response.getJSONObject("data");

		if (data == null || data.getString("url") == null || data.getString("url").length() == 0) throw new FLException(120046, "摄像头厂商请求失败");

		ConstructionCameraLiveVO liveVO = new ConstructionCameraLiveVO();
		liveVO.setCameraId(cameraPO.getCcid());
		liveVO.setUrl(data.getString("url"));
		liveVO.setProtocol(protocol == null || protocol.length() == 0 ? PROTOCOL_HLS_STR : protocol);
		liveVO.setExpireTime(data.getString("expireTime"));

		return liveVO;
	}

	@Override
	public String capture(ConstructionCameraPO cameraPO, int company) throws FLException {

		String accessToken = getAccessToken(company);

		List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
		params.add(new BasicNameValuePair("accessToken", accessToken));
		params.add(new BasicNameValuePair("deviceSerial", cameraPO.getDeviceSerial()));
		params.add(new BasicNameValuePair("channelNo", String.valueOf(cameraPO.getChannelNo())));

		if (cameraPO.getVerifyCode() != null && cameraPO.getVerifyCode().length() != 0) {
			params.add(new BasicNameValuePair("validateCode", AESHelper.decrypt(cameraPO.getVerifyCode(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"))));
		}

		JSONObject response = HttpUtil.httpPost(host(company) + "/api/lapp/device/capture", params);

		check(response);

		JSONObject data = response.getJSONObject("data");

		if (data == null || data.getString("picUrl") == null || data.getString("picUrl").length() == 0) throw new FLException(120046, "摄像头厂商请求失败");

		return data.getString("picUrl");
	}

	@Override
	public short queryOnlineStatus(ConstructionCameraPO cameraPO, int company) throws FLException {

		String accessToken = getAccessToken(company);

		List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
		params.add(new BasicNameValuePair("accessToken", accessToken));
		params.add(new BasicNameValuePair("pageStart", "0"));
		params.add(new BasicNameValuePair("pageSize", "50"));

		JSONObject response = HttpUtil.httpPost(host(company) + "/api/lapp/device/list", params);

		check(response);

		JSONArray devices = response.getJSONArray("data");

		if (devices == null) return ConstructionCameraPO.ONLINE_UNKNOWN_INT;

		for (int i = 0; i < devices.size(); i++) {

			JSONObject device = devices.getJSONObject(i);

			if (cameraPO.getDeviceSerial().equals(device.getString("deviceSerial"))) {
				return device.getShortValue("status") == 1 ? ConstructionCameraPO.ONLINE_ON_INT : ConstructionCameraPO.ONLINE_UNKNOWN_INT;
			}
		}

		return ConstructionCameraPO.ONLINE_UNKNOWN_INT;
	}

	private String getAccessToken(int company) throws FLException {

		SystemConfigPO appKey = systemConfigDao.querySystemConfig(CONFIG_APPKEY_STR, company);
		SystemConfigPO appSecret = systemConfigDao.querySystemConfig(CONFIG_APPSECRET_STR, company);

		if (appKey == null) appKey = systemConfigDao.querySystemConfig(CONFIG_APPKEY_STR);
		if (appSecret == null) appSecret = systemConfigDao.querySystemConfig(CONFIG_APPSECRET_STR);

		if (appKey == null || appKey.getValue() == null || appKey.getValue().length() == 0 || appSecret == null || appSecret.getValue() == null || appSecret.getValue().length() == 0) throw new FLException(120045, "摄像头厂商配置不存在");

		List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
		params.add(new BasicNameValuePair("appKey", appKey.getValue()));
		params.add(new BasicNameValuePair("appSecret", appSecret.getValue()));

		JSONObject response = HttpUtil.httpPost(host(company) + "/api/lapp/token/get", params);

		check(response);

		JSONObject data = response.getJSONObject("data");

		if (data == null || data.getString("accessToken") == null) throw new FLException(120046, "摄像头厂商请求失败");

		return data.getString("accessToken");
	}

	private String host(int company) {

		SystemConfigPO host = systemConfigDao.querySystemConfig(CONFIG_HOST_STR, company);

		if (host == null) host = systemConfigDao.querySystemConfig(CONFIG_HOST_STR);

		return host == null || host.getValue() == null || host.getValue().length() == 0 ? DEFAULT_HOST_STR : host.getValue();
	}

	private void check(JSONObject response) throws FLException {

		if (response == null) throw new FLException(120046, "摄像头厂商请求失败");

		if (!CODE_SUCCESS_STR.equals(response.getString("code"))) {
			throw new FLException(120046, "摄像头厂商请求失败");
		}
	}

}
