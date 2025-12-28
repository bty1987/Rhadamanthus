/**
 * @File Name		: WeChatServerServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信服务器配置服务实现类
 */

package com.fanglin.wechat.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.wechat.service.WeChatServerService;

/**
 * 微信服务器配置服务实现
 * 用于管理微信相关服务器地址配置
 */
@Service("weChatServerService")
@Transactional(readOnly = true)
public class WeChatServerServiceImpl implements WeChatServerService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public String communion(String communion) {

		if ("test".equals(communion)) {
			// 测试环境地址
			communion = "http://192.168.5.21/";
		} else {
			// 从系统配置获取 communion 服务器地址
			SystemConfigPO config = systemConfigDao.querySystemConfig("WECHAT_COMMUNION_URL");

			// 如果配置不存在，使用默认地址
			communion = (config != null && config.getValue() != null) ? config.getValue() : "http://121.36.27.123/";
		}

		return communion;
	}

}
