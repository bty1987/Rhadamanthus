/**
 * @File Name		: WeChatAppServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2017-5-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信小程序服务实现类
 */

package com.fanglin.wechat.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.dao.WeChatAppSessionDao;
import com.fanglin.wechat.dao.WeChatOpenUnionDao;
import com.fanglin.wechat.po.WeChatAppSessionPO;
import com.fanglin.wechat.po.WeChatOpenUnionPO;
import com.fanglin.wechat.service.WeChatAccessTokenService;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.utils.AES;
import com.fanglin.wechat.utils.WeChatApi;
import com.fanglin.wechat.utils.WxPKCS7Encoder;
import com.fanglin.wechat.vo.WeChatGroupInfoVO;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;
import com.fanglin.wechat.vo.WeChatUserInfoVO;

/**
 * 微信小程序服务实现
 */
@Service("weChatAppService")
@Transactional(readOnly = true)
public class WeChatAppServiceImpl implements WeChatAppService {

	@Autowired
	private WeChatAccessTokenService accessTokenService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private WeChatAppSessionDao weChatAppSessionDao;

	@Autowired
	private WeChatOpenUnionDao weChatOpenUnionDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public WeChatUserInfoVO makeSession(String code, String company) throws FLException {

		int $company = FormatUtil.decodeCompany(company);

		WeChatUserInfoVO userInfoVO = null;

		// 检查 session 是否已存在
		WeChatAppSessionPO wxAppSessionPO = weChatAppSessionDao.queryWeChatAppSessionByCode(code);
		if (wxAppSessionPO != null) {
			throw new FLException(910116, "Session信息已存在");
		}

		// 获取小程序配置（type=1 表示小程序）
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");
		SystemConfigPO appid = systemConfigDao.querySystemConfig("WECHAT_APPID_1", $company);
		SystemConfigPO appsecret = systemConfigDao.querySystemConfig("WECHAT_SECRET_1", $company);

		String url = String.format(WeChatApi.WAAPI_GET_SESSION_STR, wapi.getValue(), appid.getValue(), appsecret.getValue(), code);

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("session_key")) {

			String sessionKey = response.getString("session_key");
			String openId = response.getString("openid");
			String unionId = response.getString("unionid");

			if (openId == null || unionId == null) return userInfoVO;

			// 保存 session 信息
			wxAppSessionPO = new WeChatAppSessionPO(code, sessionKey, openId, new Date().getTime());

			weChatAppSessionDao.save(wxAppSessionPO);

			userInfoVO = new WeChatUserInfoVO(openId, unionId);

			// 保存 OpenID 与 UnionID 的关联关系
			WeChatOpenUnionPO wxOpenUnionPO = weChatOpenUnionDao.queryWeChatOpenUnion(openId);

			if (wxOpenUnionPO == null || wxOpenUnionPO.getCompany() != $company) {

				wxOpenUnionPO = new WeChatOpenUnionPO();
				wxOpenUnionPO.setUnionId(unionId);
				wxOpenUnionPO.setOpenId(openId);
				wxOpenUnionPO.setType(WeChatOpenUnionPO.TYPE_APPLET_INT);
				wxOpenUnionPO.setCompany($company);

				weChatOpenUnionDao.save(wxOpenUnionPO);
			}
		} else {
			System.out.println(url);
			System.out.println(response.toJSONString());
		}

		return userInfoVO;
	}

	@Override
	public WeChatUserInfoVO queryUserInfo(String code, String encryptedData, String iv, String company) throws FLException {

		int $company = FormatUtil.decodeCompany(company);

		// 获取小程序配置（type=1 表示小程序）
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");
		SystemConfigPO appid = systemConfigDao.querySystemConfig("WECHAT_APPID_1", $company);
		SystemConfigPO appsecret = systemConfigDao.querySystemConfig("WECHAT_SECRET_1", $company);

		String url = String.format(WeChatApi.WAAPI_GET_SESSION_STR, wapi.getValue(), appid.getValue(), appsecret.getValue(), code);

		JSONObject response = HttpHelper.httpGet(url);

		if (response == null || !response.containsKey("session_key")) {
			throw new FLException(910117, "获取用户信息失败");
		}

		String sessionKey = response.getString("session_key");

		AES aes = new AES();

		try {
			byte[] resultByte = aes.decrypt(Base64.decodeBase64(encryptedData), Base64.decodeBase64(sessionKey), Base64.decodeBase64(iv));

			if (null != resultByte && resultByte.length > 0) {
				String userInfo = new String(WxPKCS7Encoder.decode(resultByte));
				return JSONObject.parseObject(userInfo, WeChatUserInfoVO.class);
			}
		} catch (Exception e) {
			throw new FLException(910117, "获取用户信息失败");
		}

		return null;
	}

	@Override
	public WeChatUserInfoVO queryUserInfo(String code, String encryptedData, String iv) throws FLException {

		// 从数据库查询 session 信息
		WeChatAppSessionPO wxAppSessionPO = weChatAppSessionDao.queryWeChatAppSessionByCode(code);
		if (wxAppSessionPO == null) {
			throw new FLException(910118, "Session信息不存在");
		}

		// 使用缓存的 sessionKey 解密
		WeChatUserInfoVO userInfoVO = null;
		AES aes = new AES();
		try {
			byte[] resultByte = aes.decrypt(Base64.decodeBase64(encryptedData), Base64.decodeBase64(wxAppSessionPO.getSessionKey()), Base64.decodeBase64(iv));
			if (null != resultByte && resultByte.length > 0) {
				String userInfo = new String(WxPKCS7Encoder.decode(resultByte));
				userInfoVO = JSONObject.parseObject(userInfo, WeChatUserInfoVO.class);
			}
		} catch (Exception e) {
			throw new FLException(910117, "获取用户信息失败");
		}

		return userInfoVO;
	}

	@Override
	public WeChatGroupInfoVO queryGroupInfo(String code, String encryptedData, String iv) throws FLException {

		// 从数据库查询 session 信息
		WeChatAppSessionPO wxAppSessionPO = weChatAppSessionDao.queryWeChatAppSessionByCode(code);
		if (wxAppSessionPO == null) {
			throw new FLException(910118, "Session信息不存在");
		}

		// 使用缓存的 sessionKey 解密
		WeChatGroupInfoVO groupInfoVO = null;
		AES aes = new AES();
		try {
			byte[] resultByte = aes.decrypt(Base64.decodeBase64(encryptedData), Base64.decodeBase64(wxAppSessionPO.getSessionKey()), Base64.decodeBase64(iv));
			if (null != resultByte && resultByte.length > 0) {
				String groupInfo = new String(WxPKCS7Encoder.decode(resultByte));
				groupInfoVO = JSONObject.parseObject(groupInfo, WeChatGroupInfoVO.class);
			}
		} catch (Exception e) {
			throw new FLException(910131, "获取群信息失败");
		}

		return groupInfoVO;
	}

	@Override
	public WeChatPhoneInfoVO queryPhoneInfo(String code, String company) throws FLException {

		// 获取 AccessToken
		String accessToken = accessTokenService.queryAccessToken(company).getAccesstoken();

		// 获取微信 API 配置
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");

		String url = String.format(WeChatApi.WXAPI_GET_PHONE_INFO_STR, wapi.getValue(), accessToken);

		Map<String, String> params = new HashMap<String, String>();
		params.put("code", code);

		JSONObject response = HttpHelper.httpPost(url, params);

		WeChatPhoneInfoVO phoneInfoVO = null;

		if (response == null) {
			throw new FLException(910117, "获取用户信息失败");
		}

		if (response.containsKey("errcode") && response.getInteger("errcode") != 0) {
			System.out.println(response.toJSONString());
			throw new FLException(910117, "获取用户信息失败");
		}

		phoneInfoVO = JSONObject.parseObject(JSONObject.toJSONString(response.get("phone_info")), WeChatPhoneInfoVO.class);

		return phoneInfoVO;
	}

	@Override
	public int deleteSession() {
		// 删除过期的 session（超过 24 小时的）
		long expireTime = new Date().getTime() - (24 * 60 * 60 * 1000);
		return weChatAppSessionDao.deleteWeChatAppSession(expireTime);
	}

}
