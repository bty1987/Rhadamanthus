package com.fanglin.information.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessageQueuingPO;

/**
 * Title: MessageQueuingDaoImpl
 * Description: 消息队列DAO实现
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */
@Repository("messageQueuingDao")
public class MessageQueuingDaoImpl extends DaoImpl<MessageQueuingPO> implements MessageQueuingDao {

	public MessageQueuingDaoImpl() {
		super(MessageQueuingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MessageQueuingPO> queryPendingMessageQueuing() {
		Criteria query = session().createCriteria(MessageQueuingPO.class);
		query.add(Restrictions.eq("status", MessageQueuingPO.STATUS_PENDING_INT));
		query.add(Restrictions.isNull("finishTime"));
		return query.list();
	}

	@Override
	public int updateMessageQueuingStatusProcessed(long mqid) {
		String sql = "update information.messagequeuing set status = :status, finishtime = CURRENT_TIMESTAMP where mqid = :mqid";
		session().createSQLQuery(sql)
			.setShort("status", MessageQueuingPO.STATUS_PROCESSED_INT)
			.setLong("mqid", mqid)
			.executeUpdate();
		return 0;
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MessageQueuingPO> queryPendingMessageQueuingByOperation(String operation) {
		Criteria query = session().createCriteria(MessageQueuingPO.class);
		query.add(Restrictions.eq("status", MessageQueuingPO.STATUS_PENDING_INT));
		query.add(Restrictions.eq("operation", operation));
		query.add(Restrictions.isNull("finishTime"));
		return query.list();
	}

}
