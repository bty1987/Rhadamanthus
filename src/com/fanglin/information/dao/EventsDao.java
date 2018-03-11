/**
 * @File Name		: EventsDao.java
 * @Package   	: com.fanglin.information.dao
 * @Version		: 1.0
 * @Date			: 2016-11-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao;

import java.text.ParseException;
import java.util.List;

import org.hibernate.HibernateException;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.EventsPO;

public interface EventsDao extends Dao<EventsPO> {
	
	public List<EventsPO> queryEvents(List<Filter> filters) throws ParseException;
	
	public List<EventsPO> queryEvents(int uid, String beginDate, String endDate) throws HibernateException, ParseException;
	
	public int countEvents(int uid, String showDate) throws ParseException;
	
}
