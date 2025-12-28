package com.fanglin.wechat.dao.impl;

import com.fanglin.wechat.po.WeChatUserInfoPO;

public interface WeChatUserInfoDao {

	public WeChatUserInfoPO queryWeChatUserInfoByUnionId(String unionId);

}
