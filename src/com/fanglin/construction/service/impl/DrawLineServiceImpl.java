/**
 * @File Name	: DecorationeServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date		: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstructionNodeDao;
import com.fanglin.communion.po.ConstructionNodeCompanyPO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.service.DrawLineService;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.DrawLineGroupVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationDrawLineService")
@Transactional(readOnly = true)
public class DrawLineServiceImpl implements DrawLineService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DrawLineDao drawlineDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private DrawLineGroupDao drawLineGroupDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DrawLineVO> pageDrawLine(Paging paging, List<Filter> filters, Integer company) {

		List<DrawLinePO> drawLinePOs = drawlineDao.pageDrawLine(paging, filters, company);

		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();

		for (DrawLinePO drawLinePO : drawLinePOs) {
			
			drawLineVOs.add(convertBean(drawLinePO));
			
		}

		paging.setData(drawLineVOs);

		return drawLineVOs;
	}
	
	@Override
	public List<DrawLineVO> queryDrawLine(List<Filter> filters, Integer company) throws FLException {
		
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();
		
		if (filters.size() == 0)
			return drawLineVOs;
		
		List<String> files = new ArrayList<String>();
		for (Filter filter: filters) {
			files.add(filter.getField());
		}
		
		if(!files.contains("actualDate")){
			return drawLineVOs;
		}
		
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(filters, company);

		for (DrawLinePO drawLinePO : drawLinePOs) {
			
			drawLineVOs.add(convertBean(drawLinePO));

		}

		return drawLineVOs;
	}

	@Override
	public HashMap<String, HashMap<String, Integer>> countDrawLineByDate(DrawLineVO drawLineVO, Integer company) throws ParseException {

		Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.getFirstDay((new SimpleDateFormat("yyyy-MM-dd hh:mm")).parse(drawLineVO.getStartTime())));
		Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.getLastDay((new SimpleDateFormat("yyyy-MM-dd hh:mm")).parse(drawLineVO.getEndTime())));
		
		HashMap<String, HashMap<String, Integer>> drawLineInfos = new HashMap<String, HashMap<String, Integer>>();

		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(startTime, endTime, company);

		for (DrawLinePO drawLinePO : drawLinePOs) {

			String d = DateUtil.getDateToDateString(drawLinePO.getActualStartTime(), "yyyy-MM-dd");
			

			if (drawLineInfos.get(d) != null) {

				HashMap<String, Integer> groupCount = drawLineInfos.get(d);

				if (groupCount.get(drawLinePO.getDrawLineGroup().getName()) != null) {
					groupCount.put(drawLinePO.getDrawLineGroup().getName(), groupCount.get(drawLinePO.getDrawLineGroup().getName()).intValue() + 1);
				} else {

					groupCount.put(drawLinePO.getDrawLineGroup().getName(), 1);
				}
			} else {

				HashMap<String, Integer> groupCount = new HashMap<String, Integer>();
				groupCount.put(drawLinePO.getDrawLineGroup().getName(), 1);
				drawLineInfos.put(d, groupCount);
			}
		}

		return drawLineInfos;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int applayDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		String orderId = drawLineVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByOrderId(orderId);

		DrawLinePO decorationDrawLinePO = null;
		DrawLinePO newDrawLine = new DrawLinePO();

		newDrawLine.setCount(0);

		if (drawLinePOs != null && drawLinePOs.size() > 0) {

			decorationDrawLinePO = drawLinePOs.get(0);
			if (decorationDrawLinePO.getStatus() != DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT) {
				throw new FLException(120013, "已经在队列中,不可重复提交");
			}

			newDrawLine.setCount(decorationDrawLinePO.getCount() + 1);
		}

		newDrawLine.setApplayTime(drawLineVO.getApplayTime());
		newDrawLine.setDecoration(decorationPO);
		newDrawLine.setApplayUser(userDao.queryUserByUserId(userId));
		newDrawLine.setStatus(DrawLinePO.DRAWLINE_STATUS_QUEUE_SHORT);
		newDrawLine.setContent(drawLineVO.getContent());

		drawlineDao.saveOrUpdate(newDrawLine);

		// 设置装修订单的初始进度
		List<ConstructionNodeCompanyPO> constructionNodeCompanyPOs = constructionNodeDao.queryConstructionNodeCompanyByCid(decorationPO.getCompany());
		
		Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			
			constructionPO = new ConstructionPO(decorationPO);
			constructionPO.setStartTime(drawLineVO.getApplayTime());
			
			constructionDao.save(constructionPO);

			long cid = constructionPO.getCid();

			for (ConstructionNodeCompanyPO constructionNodeCompanyPO : constructionNodeCompanyPOs) {

				ConstructionSchedulePO constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, currentTime, currentTime, constructionNodeCompanyPO.getConstructionNode().getSort());
				constructionScheduleDao.save(constructionSchedulePO);
			}
		}

		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);

		decorationDao.update(decorationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetDrawLine(DrawLineVO drawLineVO, Integer company) throws FLException {

		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());
		
		if (drawLinePO == null) {
			throw new FLException(120014, "不存在该放线信息");
		}

		Date date = DateUtil.parseDate(drawLineVO.getEndTime(), "yyyy-MM-dd HH:mm");

		Timestamp end = DateUtil.getDateToTimestamp(date);

		date = DateUtil.parseDate(drawLineVO.getStartTime(), "yyyy-MM-dd HH:mm");

		Timestamp start = DateUtil.getDateToTimestamp(date);
		
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByGroupATime(drawLineVO.getDrawLineGroup().getGid(), start, end, company);
		
		if (drawLinePOs != null && drawLinePOs.size() > 0) {

			if (!(drawLinePOs.size() == 1 && drawLinePOs.get(0).getDecoration().getOrderId().equals(drawLinePO.getDecoration().getOrderId()))) {
				throw new FLException(120015, "时间重叠不能申请放线计划");
			}

		}

		DrawLineGroupPO drawLineGroupPO = drawLineGroupDao.get(drawLineVO.getDrawLineGroup().getGid());

		if (drawLineGroupPO == null) {
			throw new FLException(120016, "不存在放线小组");
		}

		drawLinePO.setStatus(DrawLinePO.DRAWLINE_STATUS_APPLICATION_SHORT);
		drawLinePO.setActualEndTime(end);
		drawLinePO.setActualStartTime(start);
		drawLinePO.setDrawLineGroup(drawLineGroupPO);

		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDrawLineForStatus(DrawLineVO drawLineVO, String userId, Integer company) throws FLException {

		DrawLinePO drawLinePO = drawlineDao.get((long)drawLineVO.getDlId());

		if (drawLinePO == null) {
			throw new FLException(120014, "不存在该放线信息");
		}

		short statusForPO = drawLinePO.getStatus();

		short statusForVO = drawLineVO.getStatus();
		
		if ((statusForPO == DrawLinePO.DRAWLINE_STATUS_APPLICATION_SHORT) || (DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT == statusForVO && DrawLinePO.DRAWLINE_STATUS_APPLICATION_SHORT == statusForPO) || (DrawLinePO.DRAWLINE_STATUS_QUEUE_SHORT == statusForVO && DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT == statusForPO) || (DrawLinePO.DRAWLINE_STATUS_SUCCESS_SHORT == statusForVO) || (DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT == statusForVO)) {

			drawLinePO.setStatus(statusForVO);
			
			if (statusForVO == DrawLinePO.DRAWLINE_STATUS_FAIL_SHORT) {
				messageService.sendMessage(drawLinePO.getDecoration().getDesigner().getUserId(), userId, (String.format("订单:%s,放线失败!请重新申请放线.", drawLinePO.getDecoration().getOrderId())), MessagePO.MESSAGE_TYPE_SEND_CONSTRUCTION_STR, company);
			}

		} else {

			throw new FLException(120017, "订单放线状态错误");

		}

		drawlineDao.saveOrUpdate(drawLinePO);

		return 0;
	}
	
	public DrawLineVO convertBean(DrawLinePO drawLinePO) {

		DrawLineVO drawLineVO = new DrawLineVO(new DecorationVO(), new UserVO(),new DrawLineGroupVO(), new UserVO());

		BeanUtil.copyProperties(drawLinePO, drawLineVO, Arrays.asList("decoration", "applayUser", "drawLineGroup", "drawLineUser"));

		if (drawLinePO.getDecoration() != null) {
			drawLinePO.getDecoration().ptvcascade(drawLineVO.getDecoration());
			drawLineVO.getDecoration().setSupervisor(new UserBaseVO());
			if (drawLinePO.getDecoration().getSupervisor() != null) {
				drawLineVO.getDecoration().getSupervisor().setDuty(new DutyVO());
				drawLineVO.getDecoration().getSupervisor().setDept(new DepartmentVO());
				drawLineVO.getDecoration().getSupervisor().getDept().setFatherDept(new DepartmentVO());

				BeanUtil.copyPropertie(drawLinePO.getDecoration().getSupervisor(), drawLineVO.getDecoration().getSupervisor(), Arrays.asList("duty", "dept"));
				BeanUtil.copyPropertie(drawLinePO.getDecoration().getSupervisor().getDuty(), drawLineVO.getDecoration().getSupervisor().getDuty(), Arrays.asList("departmentType"));
				BeanUtil.copyPropertie(drawLinePO.getDecoration().getSupervisor().getDept(), drawLineVO.getDecoration().getSupervisor().getDept(), Arrays.asList("type", "fatherDept", "manager"));
				BeanUtil.copyPropertie(drawLinePO.getDecoration().getSupervisor().getDept().getFatherDept(), drawLineVO.getDecoration().getSupervisor().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
			}
		}

		if (drawLinePO.getApplayUser() != null) {
			BeanUtil.copyProperties(drawLinePO.getApplayUser(), drawLineVO.getApplayUser(), Arrays.asList("role","dept","duty"));
		}
		
		if(drawLinePO.getDrawLineGroup() != null){
			BeanUtil.copyProperties(drawLinePO.getDrawLineGroup(), drawLineVO.getDrawLineGroup());
		}
		
		if(drawLinePO.getDrawLineUser() != null){
			BeanUtil.copyProperties(drawLinePO.getDrawLineUser(), drawLineVO.getDrawLineUser(), Arrays.asList("role","dept","duty"));
			BeanUtil.copyProperties(drawLinePO.getApplayUser().getRole(), drawLineVO.getApplayUser().getRole());
			BeanUtil.copyProperties(drawLinePO.getApplayUser().getDept(), drawLineVO.getApplayUser().getDept(),Arrays.asList("type","fatherDept","manager"));
			BeanUtil.copyProperties(drawLinePO.getApplayUser().getDuty(), drawLineVO.getApplayUser().getDuty(),Arrays.asList("departmentType"));
		}
		
		return drawLineVO;
		
	}

}