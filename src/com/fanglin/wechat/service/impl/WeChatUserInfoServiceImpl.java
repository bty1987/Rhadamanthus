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
import com.fanglin.common.po.WXUserInfoPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.wechat.service.WeChatAccessTokenService;
import com.fanglin.wechat.service.WeChatUserInfoService;
import com.fanglin.wechat.vo.WeChatAccessTokenVO;
import com.fanglin.wechat.vo.WeChatUserInfoVO;
import com.fanglin.wechat.utils.WeChatApi;

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
		String url = String.format(WeChatApi.WXAPI_GET_USER_INFO_STR,
			wapi.getValue(), accessTokenVO.getAccesstoken(), openId);

		JSONObject response = HttpHelper.httpGet(url);

		if (response != null && response.containsKey("openid")) {

			// 检查用户是否关注公众号
			if (response.getInteger("subscribe") != 1) {
				throw new FLException(910136, "用户未关注公众号");
			}

			userInfoVO = JSONObject.parseObject(response.toJSONString(), WeChatUserInfoVO.class);

			// TODO: 保存用户信息到数据库（需要创建对应的 DAO）
			// WXUserInfoPO wxUserInfoPO = wxUserInfoDao.queryWxUserInfoByUnionId(userInfoVO.getUnionid());
			// if (wxUserInfoPO == null) {
			//     wxUserInfoPO = new WXUserInfoPO();
			//     BeanUtil.copyProperties(userInfoVO, wxUserInfoPO);
			//     wxUserInfoPO.setCreateTime(new Date().getTime());
			//     wxUserInfoDao.save(wxUserInfoPO);
			// }

			// TODO: 保存 OpenID 与 UnionID 的关联关系（需要创建对应的 DAO）
			// WXOpenUnionPO wxOpenUnionPO = wxOpenUnionDao.queryWxOpenUnion(openId);
			// if (wxOpenUnionPO == null) {
			//     wxOpenUnionPO = new WXOpenUnionPO(userInfoVO.getUnionid(), openId,
			//         WXOpenUnionPO.TYPE_PUBLIC_INT, 1);
			//     wxOpenUnionDao.save(wxOpenUnionPO);
			// }
		} else {
			throw new FLException(910119, "获取用户信息失败");
		}

		return userInfoVO;
	}

}
