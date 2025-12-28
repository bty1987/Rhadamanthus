package com.fanglin.wechat.dao.impl;

import com.fanglin.wechat.po.WeChatAppSessionPO;

public interface WeChatAppSessionDao {

	public WeChatAppSessionPO queryWeChatAppSessionByCode(String code);

	public WeChatAppSessionPO queryWeChatAppSessionByOpenid(String openId);

	public int deleteWeChatAppSession(long operateTime);

}
