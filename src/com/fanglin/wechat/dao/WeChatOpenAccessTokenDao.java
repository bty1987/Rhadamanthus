/**
 * @File Name		: WeChatOpenAccessTokenDao.java
 * @Package   	: com.fanglin.wechat.dao
 * @Version		: 1.0
 * @Date			: 2016-6-4
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信 Open AccessToken DAO 接口
 */

package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.WeChatOpenAccessTokenPO;

public interface WeChatOpenAccessTokenDao extends Dao<WeChatOpenAccessTokenPO> {

	public WeChatOpenAccessTokenPO queryOpenAccessToken(String code);

	public int deleteOpenAccessToken(long operateTime);

}
