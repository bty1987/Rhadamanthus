/**
 * @File Name		: MessageTemplateDaoImpl.java
 * @Package   	: com.fanglin.message.dao.impl
 * @Version		: 1.0
 * @Date			: 2017-7-3
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.dao.WeChatMessageTemplateDao;
import com.fanglin.wechat.po.WeChatMessageTemplatePO;

@Repository("messageTemplateDao")
public class WeChatMessageTemplateDaoImpl extends DaoImpl<WeChatMessageTemplatePO> implements WeChatMessageTemplateDao {

	public WeChatMessageTemplateDaoImpl() {
		super(WeChatMessageTemplatePO.class);
	}

	@Override
	public WeChatMessageTemplatePO queryMessageTemplate(String name, short type) {
		return (WeChatMessageTemplatePO) session().createCriteria(WeChatMessageTemplatePO.class).add(Restrictions.eq(WeChatMessageTemplatePO.COLUMN_NAME_STR, name)).add(Restrictions.eq(WeChatMessageTemplatePO.COLUMN_TYPE_STR, type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public WeChatMessageTemplatePO queryMessageTemplate(String name, short type, int company) {
		return (WeChatMessageTemplatePO) session().createCriteria(WeChatMessageTemplatePO.class).add(Restrictions.eq(WeChatMessageTemplatePO.COLUMN_NAME_STR, name)).add(Restrictions.eq(WeChatMessageTemplatePO.COLUMN_TYPE_STR, type)).add(Restrictions.eq(WeChatMessageTemplatePO.COLUMN_COMPANY_STR, company)).setMaxResults(1).uniqueResult();
	}

}
