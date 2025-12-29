/**
 * @File Name		: WeChatUserBindServiceImpl.java
 * @Package   	: com.fanglin.wechat.service.impl
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定服务实现类
 */

package com.fanglin.wechat.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.wechat.dao.WeChatUserBindDao;
import com.fanglin.wechat.po.WeChatUserBindPO;
import com.fanglin.wechat.service.WeChatUserBindService;
import com.fanglin.wechat.vo.WeChatUserBindVO;

/**
 * 微信用户绑定服务实现 用于管理微信用户与系统用户的绑定关系
 */
@Service("weChatUserBindService")
@Transactional(readOnly = true)
public class WeChatUserBindServiceImpl implements WeChatUserBindService {

	@Autowired
	private WeChatUserBindDao weChatUserBindDao;

	@Override
	public WeChatUserBindVO queryUserBind(WeChatUserBindVO weChatUserBindVO) {

		WeChatUserBindPO weChatUserBindPO = weChatUserBindDao.queryWeChatUserBind(weChatUserBindVO.getUnionId());

		if (weChatUserBindPO != null) {
			weChatUserBindVO.setUserId(weChatUserBindPO.getUserId());
		}

		return weChatUserBindVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserBind(WeChatUserBindVO userBindVO) {

		weChatUserBindDao.deleteWeChatUserBind(userBindVO.getUserId());

		weChatUserBindDao.save(new WeChatUserBindPO(userBindVO.getUnionId(), userBindVO.getUserId()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteUserBind(WeChatUserBindVO weChatUserBindVO) {

		if (weChatUserBindVO.getUnionId() == null) return 0;

		WeChatUserBindPO weChatUserBindPO = weChatUserBindDao.queryWeChatUserBind(weChatUserBindVO.getUnionId());

		if (weChatUserBindPO == null) return 0;

		weChatUserBindDao.delete(weChatUserBindPO);

		return 0;
	}

}
