/**
 * @File Name		: EventsService.java
 * @Package   	: com.fanglin.information.service
 * @Version		: 1.0
 * @Date			: 2016-11-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service;

import java.text.ParseException;
import java.util.List;

import org.hibernate.HibernateException;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.vo.EventsVO;

public interface EventsService {
	
	public List<EventsVO> queryEvents(EventsVO eventsVO, String userId) throws HibernateException, ParseException;
	
	public int addEvents(EventsVO eventsVO, String userId) throws ParseException, FLException;
	
	public int deleteEvents(EventsVO eventsVO, String userId) throws FLException;

}
