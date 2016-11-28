/**
 * @File Name		: EventsServiceImpl.java
 * @Package   	: com.fanglin.information.service.impl
 * @Version		: 1.0
 * @Date			: 2016-11-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.information.dao.EventsDao;
import com.fanglin.information.po.EventsPO;
import com.fanglin.information.service.EventsService;
import com.fanglin.information.vo.EventsVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("eventsService")
@Transactional(readOnly=true)
public class EventsServiceImpl implements EventsService {
	
	@Autowired
	private EventsDao eventsDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<EventsVO> queryEvents(EventsVO eventsVO, String userId) throws HibernateException, ParseException {
		
		List<EventsPO> eventsPOs = eventsDao.queryEvents(userId, eventsVO.getBeginDate(), eventsVO.getEndDate());
		List<EventsVO> eventsVOs = new ArrayList<EventsVO>();
		
		for(EventsPO eventsPO: eventsPOs){
			eventsVO = new EventsVO(new UserVO(), new UserVO(), new DepartmentVO(), new DepartmentVO());
			
			BeanUtil.copyProperties(eventsPO, eventsVO, Arrays.asList("creater", "holder", "department", "region"));
			
			eventsVO.getCreater().setBaseInfo(eventsPO.getCreater());
			eventsVO.getHolder().setBaseInfo(eventsPO.getHolder());
			BeanUtil.copyProperties(eventsPO.getDepartment(), eventsVO.getDepartment(), Arrays.asList("fatherDept", "cityProper", "company"));
			BeanUtil.copyProperties(eventsPO.getRegion(), eventsVO.getRegion(), Arrays.asList("fatherDept", "cityProper", "company"));
			
			eventsVOs.add(eventsVO);
		}
		
		return eventsVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addEvents(EventsVO eventsVO, String userId) throws ParseException, FLException {
		
		if(eventsDao.countEvents(userId, DateUtil.getDateToDateString(eventsVO.getShowDate(), "yyyy-MM-dd")) >= 5){
			throw new FLException(160014, "事件数量到达上限");
		}
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		EventsPO eventsPO = new EventsPO();
		
		eventsPO.setTitle(eventsVO.getTitle());
		eventsPO.setContent(eventsVO.getContent());
		eventsPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		eventsPO.setCreater(userPO);
		eventsPO.setHolder(userPO);
		eventsPO.setType(EventsPO.TYPE_CUSTOM_INT);
		eventsPO.setShowDate(eventsVO.getShowDate());
		
		eventsDao.save(eventsPO);
		
		eventsVO.setEid(eventsPO.getEid());
		eventsVO.setCreateTime(eventsPO.getCreateTime());
		eventsVO.setCreater(new UserVO());
		eventsVO.setHolder(new UserVO());
		eventsVO.getCreater().setBaseInfo(userPO);
		eventsVO.getHolder().setBaseInfo(userPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteEvents(EventsVO eventsVO, String userId) throws FLException {
		
		EventsPO eventsPO = eventsDao.get(eventsVO.getEid());
		
		if(eventsPO == null){
			throw new FLException(160015, "事件不存在");
		}
		
		if(eventsPO.getType() == EventsPO.TYPE_SYSTEM_INT || !userId.equals(eventsPO.getCreater().getUserId())){
			throw new FLException(160016, "无权限删除事件");
		}
		
		eventsDao.delete(eventsPO);
		
		return 0;
	}

}
