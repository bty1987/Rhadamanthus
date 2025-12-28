package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.WeChatUserInfoPO;

public interface WeChatUserInfoDao extends Dao<WeChatUserInfoPO> {

	public WeChatUserInfoPO queryWeChatUserInfoByUnionId(String unionId);

}
