/**
 * @File Name		: WJsapiTicketDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.dao.JsapiTicketDao;
import com.fanglin.wechat.po.JsapiTicketPO;

@Repository("jsapiTicketDao")
public class JsapiTicketDaoImpl extends DaoImpl<JsapiTicketPO> implements JsapiTicketDao {

	public JsapiTicketDaoImpl() {
		super(JsapiTicketPO.class);
	}

	@Override
	public JsapiTicketPO queryJsapiTicket(int company) {
		return (JsapiTicketPO) session().createCriteria(JsapiTicketPO.class).add(Restrictions.eq(JsapiTicketPO.COLUMN_COMPANY_STR, company)).addOrder(Order.desc(JsapiTicketPO.COLUMN_OPERATETIME_STR)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteJsapiTicket(long operateTime) {

		String sql = "delete from hades.wjsapiticket where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

}
