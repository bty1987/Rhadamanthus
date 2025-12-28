/**
 * @File Name		: DJsapiTicketDaoImpl.java
 * @Package   	: com.fanglin.common.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.dao.impl;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.dingding.dao.DingTalkJsapiTicketDao;
import com.fanglin.dingding.po.DingTalkJsapiTicketPO;

@Repository("dingTalkJsapiTicketDao")
public class DingTalkJsapiTicketDaoImpl extends DaoImpl<DingTalkJsapiTicketPO> implements DingTalkJsapiTicketDao {

	public DingTalkJsapiTicketDaoImpl() {
		super(DingTalkJsapiTicketPO.class);
	}

	@Override
	public DingTalkJsapiTicketPO queryJsapiTicket(int company) {
		return (DingTalkJsapiTicketPO) session().createCriteria(DingTalkJsapiTicketPO.class).add(Restrictions.eq(DingTalkJsapiTicketPO.COLUMN_COMPANY_STR, company)).addOrder(Order.desc(DingTalkJsapiTicketPO.COLUMN_OPERATETIME_STR)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteJsapiTicket(long operateTime) {

		String sql = "delete from hades.djsapiticket where operateTime < :operateTime";
		session().createSQLQuery(sql).setLong("operateTime", operateTime).executeUpdate();

		return 0;
	}

}
