package com.fanglin.information.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.utils.Paging;

@Repository("messageDao")
public class MessageDaoImpl extends DaoImpl<MessagePO> implements MessageDao {

	public MessageDaoImpl() {
		super(MessagePO.class);
	}

	@Override
	public List<MessagePO> pageMessages(Paging paging, List<Filter> filters, String userId, int company) {
		PagingQuery<MessagePO> query = pagingQuery(paging, MessagePO.class);
		query.add(Restrictions.eq("company", company));

		query.alias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));

		queryFilterExecute(query, filters);

		query.asc("status");
		query.desc("createTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MessagePO> queryMessageForUnreadByUserId(String userId, int company) {
		Criteria query = session().createCriteria(MessagePO.class);

		query.add(Restrictions.eq("company", company));
		query.createAlias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));
		query.add(Restrictions.eq("status", MessagePO.MESSAGE_STATUS_UNREAD_STR));

		return query.list();
	}

	@Override
	public int queryMessageCount(int uid, int company) {

		String sql = "select count(*) from information.message where ruid = :ruid and status = :status and company = :company";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("status", MessagePO.MESSAGE_STATUS_UNREAD_STR).setInteger("ruid", uid).setInteger("company", company).uniqueResult();

		return count.intValue();
	}

	@Override
	public int updateMessageForRead(List<Integer> mids) {
		String sql = "update information.message set status = :status where mid in :mids";
		session().createSQLQuery(sql).setInteger("status", MessagePO.MESSAGE_STATUS_READED_STR).setParameterList("mids", mids).executeUpdate();

		return 0;
	}

	@Override
	public void updateApproveMsgSerial(String msgSerial) {
		String sql = "update information.message set args = null where args like :args";
		session().createSQLQuery(sql).setString("args", "%" + msgSerial + "%").executeUpdate();
	}

	@Override
	public int deleteMessageByIdAStatusAUnType(List<Integer> messageIds, short status, List<String> unTypes) {

		String sql = "delete from information.message where messageId in :messageIds and status = :stauts and type not in :untypes";

		session().createSQLQuery(sql).setParameterList("messageIds", messageIds).setInteger("status", status).setParameterList("untypes", unTypes).executeUpdate();

		return 0;
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters){

		for (Filter filter : filters) {

			if ("status".equals(filter.getField())) {
				query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
			} else if ("type".equals(filter.getField())) {
				query.add(query.getCriterion("type", filter));
			} else if ("dateRange".equals(filter.getField())) {
				String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
				String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
				query.add(query.getCriterion("createTime", eTime, "le"));
				query.add(query.getCriterion("createTime", sTime, "ge"));
			}
		}
	}

}
