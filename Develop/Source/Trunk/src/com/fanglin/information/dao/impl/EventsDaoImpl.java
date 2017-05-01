/**
 * @File Name		: EventsDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.EventsDao;
import com.fanglin.information.po.EventsPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("eventsDao")
public class EventsDaoImpl extends DaoImpl<EventsPO> implements EventsDao {
	
	public EventsDaoImpl(){
		super(EventsPO.class);
	}

	@Override
	public List<EventsPO> queryEvents(List<Filter> filters) throws ParseException {
		
		PagingQuery<EventsPO> query = pagingQuery(new Paging(), EventsPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<EventsPO> queryEvents(String userId, String beginDate, String endDate) throws HibernateException, ParseException {
		return session().createCriteria(EventsPO.class).createAlias("holder", "holder")
				.add(Restrictions.eq(EventsPO.COLUMN_HODERID_STR, userId))
				.add(Restrictions.ge(EventsPO.COLUMN_SHOWDATE_STR, new SimpleDateFormat("yyyy-MM-dd").parse(beginDate)))
				.add(Restrictions.le(EventsPO.COLUMN_SHOWDATE_STR, new SimpleDateFormat("yyyy-MM-dd").parse(endDate)))
				.list();
	}

	@Override
	public int countEvents(String userId, String showDate) throws ParseException {
		
		String sql = "select count(*) from platform.events where holderId = :holderId and showDate = :showDate";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("holderId", userId).setString("showDate", showDate).uniqueResult();
		
		return count.intValue();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) throws ParseException{
		
		for(Filter filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			if("showDate".equals(field)){
				query.add(query.getCriterion(EventsPO.COLUMN_SHOWDATE_STR, new SimpleDateFormat("yyyy-MM-dd").parse(data), op));
			}else if("showDateRange".equals(field)){
				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
				
				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
				
				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
				
				query.add(query.getCriterion(EventsPO.COLUMN_SHOWDATE_STR, eTimestamp, "le"));
				query.add(query.getCriterion(EventsPO.COLUMN_SHOWDATE_STR, sTimestamp, "ge"));
			}
		}
		
	}

}
