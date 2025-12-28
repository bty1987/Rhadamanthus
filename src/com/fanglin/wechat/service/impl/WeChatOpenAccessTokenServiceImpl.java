/**
 * @File Name		: WeChatOpenAccessTokenServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 Open AccessToken 服务实现类
 */

package com.fanglin.wechat.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.dao.WeChatOpenAccessTokenDao;
import com.fanglin.wechat.po.WeChatOpenAccessTokenPO;
import com.fanglin.wechat.service.WeChatOpenAccessTokenService;
import com.fanglin.wechat.utils.WeChatApi;
import com.fanglin.wechat.vo.WeChatConfigVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service("weChatOpenAccessTokenService")
@Transactional(readOnly = true)
public class WeChatOpenAccessTokenServiceImpl implements WeChatOpenAccessTokenService {

	@Autowired
	private WeChatOpenAccessTokenDao weChatOpenAccessTokenDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int queryAccessTokenByCode(WeChatConfigVO wxConfigVO, String company) throws FLException {

		String code = wxConfigVO.getCode();
		int $company = FormatUtil.decodeCompany(company);

		WeChatOpenAccessTokenPO weChatOpenAccessTokenPO = weChatOpenAccessTokenDao.queryOpenAccessToken(code);

		// 使用 SystemConfigDao 查询配置
		// 微信公众号 type=0，使用对应的配置 key
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");
		SystemConfigPO appid = systemConfigDao.querySystemConfig("WECHAT_APPID_0", $company);
		SystemConfigPO appsecret = systemConfigDao.querySystemConfig("WECHAT_SECRET_0", $company);

		if (weChatOpenAccessTokenPO == null) {
			String url = String.format(WeChatApi.WXAPI_GET_ACCESS_TOKEN_STR, wapi.getValue(), appid.getValue(), appsecret.getValue(), code);

			JSONObject response = HttpHelper.httpGet(url);

			if (response != null && response.containsKey("access_token")) {

				String accessToken = response.getString("access_token");
				String openId = response.getString("openid");

				wxConfigVO.setAccessToken(accessToken);
				wxConfigVO.setOpenId(openId);

				weChatOpenAccessTokenPO = new WeChatOpenAccessTokenPO(code, accessToken, openId, new Date().getTime());

				weChatOpenAccessTokenDao.save(weChatOpenAccessTokenPO);
			} else {
				throw new FLException(910105, "获取信息失败,请重新打开页面");
			}
		} else {
			wxConfigVO.setAccessToken(weChatOpenAccessTokenPO.getAccesstoken());
			wxConfigVO.setOpenId(weChatOpenAccessTokenPO.getOpenId());
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOpenAccessTokenByOperateTime() {

		weChatOpenAccessTokenDao.deleteOpenAccessToken(new Date().getTime());

		return 0;
	}

}
