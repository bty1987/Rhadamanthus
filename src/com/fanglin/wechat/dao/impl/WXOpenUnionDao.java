package com.fanglin.wechat.dao.impl;

import com.fanglin.wechat.po.WeChatOpenUnionPO;

public interface WXOpenUnionDao {

	public WeChatOpenUnionPO queryWxOpenUnion(String openId);

	public WeChatOpenUnionPO queryWxOpenUnion(String unionId, short type);

	public WeChatOpenUnionPO queryWxOpenUnion(String unionId, short type, int company);

}
