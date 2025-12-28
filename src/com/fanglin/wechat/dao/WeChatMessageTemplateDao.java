/**
 * @File Name		: MessagTemplateDao.java
 * @Package   	: com.fanglin.message.dao
 * @Version		: 1.0
 * @Date			: 2017-7-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.WeChatMessageTemplatePO;

public interface WeChatMessageTemplateDao extends Dao<WeChatMessageTemplatePO> {

	public WeChatMessageTemplatePO queryMessageTemplate(String name, short type);

	public WeChatMessageTemplatePO queryMessageTemplate(String name, short type, int company);

}
