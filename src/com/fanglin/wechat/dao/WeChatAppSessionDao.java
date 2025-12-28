package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.WeChatAppSessionPO;

public interface WeChatAppSessionDao extends Dao<WeChatAppSessionPO> {

	public WeChatAppSessionPO queryWeChatAppSessionByCode(String code);

	public WeChatAppSessionPO queryWeChatAppSessionByOpenid(String openId);

	public int deleteWeChatAppSession(long operateTime);

}
