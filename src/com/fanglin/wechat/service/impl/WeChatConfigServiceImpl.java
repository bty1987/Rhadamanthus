/**
 * @File Name		: WeChatConfigServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 JS-SDK 配置服务实现类
 */

package com.fanglin.wechat.service.impl;

import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.service.WeChatAccessTokenService;
import com.fanglin.wechat.service.WeChatConfigService;
import com.fanglin.wechat.utils.WeChatApi;
import com.fanglin.wechat.vo.WeChatConfigVO;
import com.fanglin.wechat.vo.WeChatJsapiTicketVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.security.MessageDigest;
import java.util.Formatter;

/**
 * 微信 JS-SDK 配置服务实现
 */
@Service("weChatConfigService")
@Transactional(readOnly = true)
public class WeChatConfigServiceImpl implements WeChatConfigService {

	public static Logger logger = LoggerFactory.getLogger(WeChatConfigService.class);

	@Autowired
	private WeChatAccessTokenService accessTokenService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@SuppressWarnings("deprecation")
	public WeChatConfigVO queryWXConfig(WeChatConfigVO wxConfigVO) {

		String url = wxConfigVO.getUrl();
		String query = wxConfigVO.getQuery();

		if (query != null) {
			url = url + "?" + URLDecoder.decode(query);
		}

		// 获取随机字符串和 AppID 配置
		SystemConfigPO noncestr = systemConfigDao.querySystemConfig("WECHAT_NONCESTR");
		SystemConfigPO corpid = systemConfigDao.querySystemConfig("WECHAT_APPID_0",
			FormatUtil.decodeCompany(wxConfigVO.getCompany()));

		long timeStamp = System.currentTimeMillis() / 1000;

		String signedUrl = url;
		String ticket = null;
		String signature = null;

		try {
			// 获取 JsapiTicket
			WeChatJsapiTicketVO jsapiTicketVO = accessTokenService.queryJsapiTicketForNew(wxConfigVO.getCompany());
			ticket = jsapiTicketVO.getJsapiticket();

			// 生成签名
			signature = sign(ticket, noncestr.getValue(), timeStamp, signedUrl);

			wxConfigVO.setConfig(signature, noncestr.getValue(), timeStamp, corpid.getValue());

		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		return wxConfigVO;
	}

	@Override
	@SuppressWarnings("deprecation")
	public String getConfig(String urlString, String queryString, String company) {

		String url;
		String queryStringEncode = null;

		if (queryString != null) {
			queryStringEncode = URLDecoder.decode(queryString);
			url = urlString + "?" + queryStringEncode;
		} else {
			url = urlString;
		}

		// 获取随机字符串配置
		SystemConfigPO noncestr = systemConfigDao.querySystemConfig("WECHAT_NONCESTR");
		long timeStamp = System.currentTimeMillis() / 1000;
		String signedUrl = url;
		String ticket = null;
		String signature = null;

		try {
			// 获取 JsapiTicket
			WeChatJsapiTicketVO jsapiTicketVO = accessTokenService.queryJsapiTicketForNew(company);
			ticket = jsapiTicketVO.getJsapiticket();

			// 生成签名
			signature = sign(ticket, noncestr.getValue(), timeStamp, signedUrl);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		// 获取 AppID 配置（公众号 type=0）
		SystemConfigPO appid = systemConfigDao.querySystemConfig("WECHAT_APPID_0",
			FormatUtil.decodeCompany(company));

		return "({signature:'" + signature + "',nonceStr:'" + noncestr.getValue() +
			"',timeStamp:'" + timeStamp + "',appId:'" + appid.getValue() + "'})";
	}

	/**
	 * 生成微信 JS-SDK 签名
	 * @param ticket JsapiTicket
	 * @param nonceStr 随机字符串
	 * @param timeStamp 时间戳
	 * @param url URL 地址
	 * @return 签名字符串
	 */
	public static String sign(String ticket, String nonceStr, long timeStamp, String url) {

		String signInfo = "";
		String plain = String.format(WeChatApi.WXAPI_SIGN_STR, ticket, nonceStr,
			String.valueOf(timeStamp), url);

		try {
			MessageDigest sha1 = MessageDigest.getInstance("SHA-1");

			sha1.reset();
			sha1.update(plain.getBytes("UTF-8"));

			signInfo = bytesToHex(sha1.digest());
		} catch (Exception e) {
			logger.error(e.getMessage());
		}

		return signInfo;
	}

	/**
	 * 字节数组转十六进制字符串
	 * @param hash 字节数组
	 * @return 十六进制字符串
	 */
	private static String bytesToHex(byte[] hash) {
		Formatter formatter = new Formatter();
		for (byte b : hash) {
			formatter.format("%02x", b);
		}
		String result = formatter.toString();
		formatter.close();
		return result;
	}

}
