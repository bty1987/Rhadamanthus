package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.WeChatOpenUnionPO;

public interface WeChatOpenUnionDao extends Dao<WeChatOpenUnionPO> {

	public WeChatOpenUnionPO queryWeChatOpenUnion(String openId);

	public WeChatOpenUnionPO queryWeChatOpenUnion(String unionId, short type);

	public WeChatOpenUnionPO queryWeChatOpenUnion(String unionId, short type, int company);

}
