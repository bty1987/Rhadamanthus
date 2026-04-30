/**
 * @File Name     : QuotationAssignTalkDaoImpl.java
 * @Package       : com.fanglin.quotation.dao.impl
 * @Version       : 1.0
 * @Date          : 2026-04-30
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 报价分配沟通消息 DAO 实现类
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationAssignTalkDao;
import com.fanglin.quotation.po.QuotationAssignTalkPO;

/**
 * 报价分配沟通消息 DAO 实现类
 *
 * @author Claude AI
 * @date 2026-04-30
 */
@Repository("quotationAssignTalkDao")
public class QuotationAssignTalkDaoImpl extends DaoImpl<QuotationAssignTalkPO> implements QuotationAssignTalkDao {

	public QuotationAssignTalkDaoImpl() {
		super(QuotationAssignTalkPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<QuotationAssignTalkPO> queryQuotationAssignTalkByOrderId(String orderId) {
		return createCriteria(QuotationAssignTalkPO.class)
			.add(Restrictions.eq("orderId", orderId))
			.addOrder(Order.asc("sendTime"))
			.list();
	}
}
