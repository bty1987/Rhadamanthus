/**
 * Title: MessageDaoImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.utils.Paging;

@Repository("messageDao")
public class MessageDaoImpl extends DaoImpl<MessagePO> implements MessageDao {

	public MessageDaoImpl(){
		super(MessagePO.class);
	}

	@Override
	public List<MessagePO> pageMessages(Paging paging, List<FilterVO> filters, String userId){

		PagingQuery<MessagePO> query = pagingQuery(paging, MessagePO.class);
		
		query.alias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));
		
		if(filters != null){
			for(FilterVO filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("status".equals(filter.getField())){
						query.add(query.getCriterion("status", filter));
					}else if("type".equals(filter.getField())){
						query.add(query.getCriterion("type", filter));
					}else if("dateRange".equals(filter.getField())){
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-");
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-");
						query.add(query.getCriterion("createTime", eTime, "le"));
						query.add(query.getCriterion("createTime", sTime, "ge"));
					}
				}
			}
		}
		
		query.desc("status");
		query.desc("createTime");
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MessagePO> queryMessageForUnreadByUserId(String userId){
		Criteria query = session().createCriteria(MessagePO.class);
		
		query.createAlias("receiver", "receiver");
		query.add(Restrictions.eq("receiver.userId", userId));
		query.add(Restrictions.eq("status", MessagePO.MESSAGE_STATUS_UNREAD_STR));
		
		return query.list();
	}

	@Override
	public int queryMessageCount(String userId){
		String sql = "select count(messageId) from platform.message where receiverId = :receiverId and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("status", MessagePO.MESSAGE_STATUS_UNREAD_STR).setString("receiverId", userId).uniqueResult();
		
		return count.intValue();
	}
	
	@Override
	public int updateMessageForRead(List<Integer> messageIds) {
		
		String sql = "update platform.message set status = :status where messageId in :messageIds";
		session().createSQLQuery(sql).setString("status", MessagePO.MESSAGE_STATUS_READED_STR).setParameterList("messageIds", messageIds).executeUpdate();
		
		return 0;
	}

	@Override
	public void updateApproveMsgSerial(String msgSerial){
		String sql = "update platform.message set args = null where args like :args";
		session().createSQLQuery(sql).setString("args", "%"+msgSerial+"%").executeUpdate();
	}

	@Override
	public int deleteMessageByIdAStatusAUnType(List<Integer> messageIds, String status, List<String> unTypes) {
		
		String sql = "delete from platform.message where messageId in :messageIds and status = :stauts and type not in :untypes";
		
		session().createSQLQuery(sql).setParameterList("messageIds", messageIds).setString("status", status).setParameterList("untypes", unTypes).executeUpdate();
		
		return 0;
	}
	
}
