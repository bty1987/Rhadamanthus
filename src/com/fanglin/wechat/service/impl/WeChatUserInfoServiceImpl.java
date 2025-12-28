/**
 * @File Name		: WeChatUserInfoServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信公众号用户信息服务实现类
 */

package com.fanglin.wechat.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.dao.WeChatOpenUnionDao;
import com.fanglin.wechat.dao.impl.WeChatUserInfoDao;
import com.fanglin.wechat.po.WeChatOpenUnionPO;
import com.fanglin.wechat.po.WeChatUserInfoPO;
import com.fanglin.wechat.service.WeChatAccessTokenService;
import com.fanglin.wechat.service.WeChatUserInfoService;
import com.fanglin.wechat.utils.WeChatApi;
import com.fanglin.wechat.vo.WeChatAccessTokenVO;
import com.fanglin.wechat.vo.WeChatUserInfoVO;

/**
 * 微信公众号用户信息服务实现
 */
@Service("weChatUserInfoService")
@Transactional(readOnly = true)
public class WeChatUserInfoServiceImpl implements WeChatUserInfoService {

	@Autowired
	private WeChatAccessTokenService accessTokenService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private WeChatUserInfoDao wxUserInfoDao;

	@Autowired
	private WeChatOpenUnionDao wxOpenUnionDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public WeChatUserInfoVO queryUserInfo(String openId, String company) throws FLException {

		int $company = FormatUtil.decodeCompany(company);

		WeChatUserInfoVO userInfoVO = new WeChatUserInfoVO();

		// 获取 AccessToken
		WeChatAccessTokenVO accessTokenVO = accessTokenService.queryAccessToken(company);

		// 获取微信 API 配置
		SystemConfigPO wapi = systemConfigDao.querySystemConfig("WECHAT_WXAPI_PATH_STR");

		// 构建获取用户信息的 URL
		String url = String.format(WeChatApi.WXAPI_GET_USER_INFO_STR, wapi.getValue(), accessTokenVO.getAccesstoken(), openId);

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("openid")) {

			// 检查用户是否关注公众号
			if (response.getInteger("subscribe") != 1) {
				throw new FLException(910136, "用户未关注公众号");
			}

			userInfoVO = JSONObject.parseObject(response.toJSONString(), WeChatUserInfoVO.class);

			// 保存用户信息到数据库
			WeChatUserInfoPO wxUserInfoPO = wxUserInfoDao.queryWxUserInfoByUnionId(userInfoVO.getUnionid());
			if (wxUserInfoPO == null) {
				wxUserInfoPO = new WeChatUserInfoPO();
				BeanUtil.copyProperties(userInfoVO, wxUserInfoPO);
				wxUserInfoPO.setCreateTime(new Date().getTime());
				wxUserInfoDao.save(wxUserInfoPO);
			}

			// 保存 OpenID 与 UnionID 的关联关系
			WeChatOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWeChatOpenUnion(openId);
			if (wxOpenUnionPO == null) {
				wxOpenUnionPO = new WeChatOpenUnionPO();
				wxOpenUnionPO.setUnionId(userInfoVO.getUnionid());
				wxOpenUnionPO.setOpenId(openId);
				wxOpenUnionPO.setType(WeChatOpenUnionPO.TYPE_PUBLIC_INT);
				wxOpenUnionPO.setCompany(1);
				wxOpenUnionDao.save(wxOpenUnionPO);
			}
		} else {
			throw new FLException(910119, "获取用户信息失败");
		}

		return userInfoVO;
	}

}
