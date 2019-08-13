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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.ConstructionNodeDao;
import com.fanglin.communion.po.ConstructionNodePO;
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
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.common.vo.DrawLineGroupVO;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationDrawLineService")
@Transactional(readOnly = true)
public class DrawLineServiceImpl implements DrawLineService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DrawLineDao drawLineDao;

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
	public List<DrawLineVO> pageDrawLine(Paging paging, List<Filter> filters, int company) {

		List<DrawLinePO> drawLinePOs = drawLineDao.pageDrawLine(paging, filters, company);
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();

		for (DrawLinePO drawLinePO : drawLinePOs) {
			drawLineVOs.add(convertBean(drawLinePO));
		}

		paging.setData(drawLineVOs);

		return drawLineVOs;
	}

	@Override
	public List<DrawLineVO> queryDrawLine(List<Filter> filters, int company) throws FLException {

		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();

		if (filters.size() == 0)
			return drawLineVOs;

		List<String> files = new ArrayList<String>();
		for (Filter filter : filters) {
			files.add(filter.getField());
		}

		if (!files.contains("actualDate")) {
			return drawLineVOs;
		}

		List<DrawLinePO> drawLinePOs = drawLineDao.queryDrawLine(filters, company);

		for (DrawLinePO drawLinePO : drawLinePOs) {
			drawLineVOs.add(convertBean(drawLinePO));
		}

		return drawLineVOs;
	}

	@Override
	public List<?> countDrawLine(DrawLineVO drawLineVO, int company) {

		Timestamp startTime = drawLineVO.getStartTime();
		Timestamp endTime = drawLineVO.getEndTime();

		long start = Long.parseLong(DateUtil.getDateToDateString(startTime, "yyyyMMdd"));
		long end = Long.parseLong(DateUtil.getDateToDateString(endTime, "yyyyMMdd"));

		return drawLineDao.countDrawLine(start, end, company);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDrawLine(DrawLineVO drawLineVO) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "不存在该放线信息");
		}

		drawLinePO.setApplayTime(drawLineVO.getApplayTime());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int applayDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		String orderId = drawLineVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (drawLineDao.countDrawLine(orderId) != 0) {
			throw new FLException(120013, "已经在队列中,不可重复提交");
		}

		UserPO appler = userDao.queryUserByUserId(userId);

		DrawLinePO drawLinePO = new DrawLinePO();

		drawLinePO.setCount(0);
		drawLinePO.setApplayTime(drawLineVO.getApplayTime());
		drawLinePO.setDecoration(decorationPO);
		drawLinePO.setAppler(appler);
		drawLinePO.setStatus(DrawLinePO.STATUS_QUEUE_INT);
		drawLinePO.setContent(drawLineVO.getContent());
		drawLinePO.setActualTime(Long.parseLong(DateUtil.getDateToDateString(drawLineVO.getApplayTime(), "yyyyMMdd")));
		drawLinePO.setCompany(decorationPO.getCompany());

		drawLineDao.save(drawLinePO);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			constructionPO = new ConstructionPO(decorationPO);
		}

		constructionPO.setStartTime(drawLineVO.getApplayTime());

		constructionDao.saveOrUpdate(constructionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetDrawLine(DrawLineVO drawLineVO) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "不存在该放线信息");
		}

		DrawLineGroupPO drawLineGroupPO = drawLineGroupDao.get(drawLineVO.getGroup().getGid());

		if (drawLineGroupPO == null) {
			throw new FLException(120016, "不存在放线小组");
		}

		Timestamp start = drawLineVO.getStartTime();
		Timestamp end = drawLineVO.getEndTime();

		if (drawLineDao.countDrawLine(drawLineVO.getGroup().getGid(), start, end, drawLinePO.getCompany()) > 0) {
			throw new FLException(120015, "时间重叠不能申请放线计划");
		}

		drawLinePO.setStatus(DrawLinePO.STATUS_APPLICATION_INT);
		drawLinePO.setEndTime(end);
		drawLinePO.setStartTime(start);
		drawLinePO.setGroup(drawLineGroupPO);

		drawLineDao.update(drawLinePO);

		return 1;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int successDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "不存在该放线信息");
		}

		if (drawLinePO.getStatus() != DrawLinePO.STATUS_APPLICATION_INT) {
			throw new FLException(120017, "订单放线状态错误");
		}

		DecorationPO decorationPO = drawLinePO.getDecoration();

		String orderId = decorationPO.getOrderId();

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		long cid = constructionPO.getCid();

		if (constructionScheduleDao.countConstructionSchedule(cid) == 0) {

			List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNode(decorationPO.getCompany());

			Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());

			for (ConstructionNodePO constructionNodePO : constructionNodePOs) {
				constructionScheduleDao.save(new ConstructionSchedulePO(cid, orderId, currentTime, currentTime, constructionNodePO.getSort()));
			}
		}

		drawLinePO.setStatus(DrawLinePO.STATUS_SUCCESS_INT);

		drawLineDao.update(drawLinePO);

		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_INITIAL_INT) {
			decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);

			decorationDao.update(decorationPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int failureDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "不存在该放线信息");
		}

		messageService.sendMessage(drawLinePO.getDecoration().getDesigner().getUserId(), userId, (String.format("订单:%s,放线失败!请重新申请放线.", drawLinePO.getDecoration().getOrderId())), MessagePO.TYPE_SEND_CONSTRUCTION_INT, drawLinePO.getCompany());

		drawLinePO.setStatus(DrawLinePO.STATUS_FAIL_INT);

		drawLineDao.update(drawLinePO);

		return 0;
	}

	public DrawLineVO convertBean(DrawLinePO drawLinePO) {

		DrawLineVO drawLineVO = new DrawLineVO(new DecorationVO(), new UserBaseVO(), new DrawLineGroupVO(), new UserBaseVO());

		BeanUtil.copyProperties(drawLinePO, drawLineVO, Arrays.asList("decoration", "appler", "group", "drawer"));

		if (drawLinePO.getDecoration() != null) {

			drawLinePO.getDecoration().ptvcascade(drawLineVO.getDecoration());

			if (drawLinePO.getDecoration().getSupervisor() != null) {
				drawLineVO.getDecoration().setSupervisor(new UserBaseVO());
				drawLineVO.getDecoration().getSupervisor().setBaseInfo(drawLinePO.getDecoration().getSupervisor());
			}
		}

		if (drawLinePO.getAppler() != null) {
			drawLineVO.getAppler().setBaseInfo(drawLinePO.getAppler());
		}

		if (drawLinePO.getGroup() != null) {
			BeanUtil.copyProperties(drawLinePO.getGroup(), drawLineVO.getGroup());
		}

		if (drawLinePO.getDrawer() != null) {
			drawLineVO.getDrawer().setBaseInfo(drawLinePO.getDrawer());
		}

		return drawLineVO;

	}

}