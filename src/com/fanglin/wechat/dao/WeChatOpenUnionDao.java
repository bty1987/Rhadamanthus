package com.fanglin.wechat.dao;

import com.fanglin.wechat.po.WeChatOpenUnionPO;

public interface WeChatOpenUnionDao {

	public WeChatOpenUnionPO queryWeChatOpenUnion(String openId);

	public WeChatOpenUnionPO queryWeChatOpenUnion(String unionId, short type);

	public WeChatOpenUnionPO queryWeChatOpenUnion(String unionId, short type, int company);

}
