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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionAccessoryDao;
import com.fanglin.construction.dao.ConstructionCostDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionRecordDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.ConstructionCostPO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionRecordPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.service.DrawLineService;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.dao.ConstructionPeriodDao;
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.common.vo.DrawLineGroupVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.data.po.ConstructionPeriodPO;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
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
	private ConstructionCostDao constructionCostDao;

	@Autowired
	private ConstructionPeriodDao constructionPeriodDao;

	@Autowired
	private ConstructionRecordDao constructionRecordDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ConstructionAccessoryDao constructionAccessoryDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private ExtensionDao extensionDao;

	@Autowired
	private NormtionService normtionService;

	@Override
	public List<DrawLineVO> pageDrawLine(Paging paging, List<Filter> filters, DrawLineVO drawLineVO, int company) throws FLException {

		if (drawLineVO != null && drawLineVO.getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(drawLineVO.getStatus()), "eq"));
		}

		List<DrawLinePO> drawLinePOs = drawLineDao.pageDrawLine(paging, filters, company);
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();

		for (DrawLinePO drawLinePO : drawLinePOs) {
			drawLineVOs.add(drawLinePO.ptv(new DrawLineVO(new DecorationVO(), new UserBaseVO(), new DrawLineGroupVO(), new UserBaseVO())));
		}

		paging.setData(drawLineVOs);

		return drawLineVOs;
	}

	@Override
	public List<DrawLineVO> queryDrawLine(List<Filter> filters, int company) throws FLException {

		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();

		if (filters.size() == 0) return drawLineVOs;

		List<DrawLinePO> drawLinePOs = drawLineDao.queryDrawLine(filters, company);

		for (DrawLinePO drawLinePO : drawLinePOs) {
			drawLineVOs.add(drawLinePO.ptv(new DrawLineVO(new DecorationVO(), new UserBaseVO(), new DrawLineGroupVO(), new UserBaseVO())));
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
			throw new FLException(120014, "放线信息不存在");
		}

		drawLinePO.setApplayTime(drawLineVO.getApplayTime());
		drawLinePO.setActualTime(Long.parseLong(DateUtil.getDateToDateString(drawLineVO.getApplayTime(), "yyyyMMdd")));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int pretreatDrawLine(DrawLineVO drawLineVO, List<ConstructionNodeVO> constructionNodeVOs, String userId) throws FLException {

		if (drawLineVO == null) {
			throw new FLException(120014, "放线信息不存在");
		}

		if (drawLineVO.getDecoration() == null) {
			throw new FLException(130014, "装修不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(drawLineVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "装修不存在");
		}

		String orderId = decorationPO.getOrderId();

		ConstructionInfoPO constructionInfo = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfo == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {

			constructionPO = new ConstructionPO(decorationPO);

			ConstructionCostPO constructionCostPO = constructionCostDao.queryConstructionCost(decorationPO.getHouse().getBuildArea(), decorationPO.getCompany());

			SystemConfigPO accessoryLimit = systemConfigDao.querySystemConfig("accessoryLimit", decorationPO.getCompany());
			SystemConfigPO salaryLimit = systemConfigDao.querySystemConfig("salaryLimit", decorationPO.getCompany());

			if (constructionCostPO == null) {
				constructionPO.setAccessoryLimit(accessoryLimit == null ? ConstructionCostPO.ACCESSORY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
				constructionPO.setSalaryLimit(salaryLimit == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
			} else {
				constructionPO.setAccessoryLimit(constructionCostPO.getAccessory());
				constructionPO.setSalaryLimit(constructionCostPO.getSalary());
			}

			constructionPO.setStartTime(DateUtil.getDateToTimestamp(new Date()));
			constructionPO.setCreateTime((DateUtil.getDateToTimestamp(new Date())));

			ConstructionPeriodPO constructionPeriodPO = constructionPeriodDao.queryConstructionPeriod(decorationPO.getHouse().getInnerArea(), decorationPO.getCompany());

			if (constructionPeriodPO != null) {
				constructionPO.setPeriod(constructionPeriodPO.getPeriod());
			}

			if (decorationPO.getSupervisor() != null) {
				constructionPO.setSupervisor(decorationPO.getSupervisor());
			}

			if (drawLineVO.getDecoration().getSupervisor() != null) {

				UserPO supervisor = userDao.queryUserByUserId(drawLineVO.getDecoration().getSupervisor().getUserId());

				constructionRecordDao.save(new ConstructionRecordPO().init(constructionPO.getDecoration().getOrderId(), constructionPO.getCid(), operater, ConstructionRecordPO.TYPE_COMMON_INT, String.format("更换监理, 原监理: %s(%s), 现监理: %s(%s)", decorationPO.getSupervisor() != null ? decorationPO.getSupervisor().getCurrentName() : "-", decorationPO.getSupervisor() != null ? decorationPO.getSupervisor().getUserId() : "-", supervisor.getCurrentName(), supervisor.getUserId())));

				constructionPO.setSupervisor(supervisor);
				decorationPO.setSupervisor(supervisor);

				decorationDao.update(decorationPO);
			}

			constructionDao.save(constructionPO);
		}

		constructionDao.flush();

		long cid = constructionPO.getCid();

		int timelimit = 0;

		for (ConstructionNodeVO constructionNodeVO : constructionNodeVOs) {

			Timestamp drawlineTime = constructionInfo.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfo.getDrawlineTime();

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + constructionNodeVO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodeVO.getCnid());

			if (constructionSchedulePO != null) {

				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);

				constructionSchedulePO.setPeriod(constructionNodeVO.getTimeLimit());

				constructionScheduleDao.update(constructionSchedulePO);
			} else {

				ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

				if (constructionNodePO == null) continue;

				constructionScheduleDao.save(new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodeVO.getTimeLimit()).init(constructionNodePO));
			}

			timelimit = timelimit + constructionNodeVO.getTimeLimit();
		}

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

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
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

		ConstructionCostPO constructionCostPO = constructionCostDao.queryConstructionCost(drawLinePO.getDecoration().getHouse().getBuildArea(), decorationPO.getCompany());

		SystemConfigPO accessoryLimit = systemConfigDao.querySystemConfig("accessoryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimit = systemConfigDao.querySystemConfig("salaryLimit", decorationPO.getCompany());

		long ccid = 0;

		if (constructionCostPO == null) {
			constructionPO.setAccessoryLimit(accessoryLimit == null ? ConstructionCostPO.ACCESSORY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
			constructionPO.setSalaryLimit(salaryLimit == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
		} else {
			constructionPO.setAccessoryLimit(constructionCostPO.getAccessory());
			constructionPO.setSalaryLimit(constructionCostPO.getSalary());
			ccid = constructionCostPO.getCcid();
		}

		constructionPO.setStartTime(DateUtil.getDateToTimestamp(new Date()));
		constructionPO.setCreateTime((DateUtil.getDateToTimestamp(new Date())));

		ConstructionPeriodPO constructionPeriodPO = constructionPeriodDao.queryConstructionPeriod(decorationPO.getHouse().getInnerArea(), decorationPO.getCompany());

		if (constructionPeriodPO != null) {
			constructionPO.setPeriod(constructionPeriodPO.getPeriod());
		}

		constructionDao.saveOrUpdate(constructionPO);

		constructionDao.flush();

		int count = constructionAccessoryDao.countConstructionAccessory(constructionPO.getCid());

		if (count == 0) {
			constructionAccessoryDao.makeConstructionAccessory(constructionPO.getCid(), ccid);
		}

		if (drawLineVO.getDecoration().getDompany() != "") {

			decorationPO.setConpany(CompanyServiceImpl.decode(drawLineVO.getDecoration().getDompany()));

			decorationDao.update(decorationPO);
		}

		NormtionVO normtionVO = new NormtionVO(orderId, quotationPO.getQid());

		normtionService.makeNormtion(normtionVO, null, userId);

		quotationDao.flush();

		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(orderId);

		for (ExtensionPO extensionPO : extensionPOs) {
			normtionService.makeNormtion(normtionVO, new ExtensionVO(extensionPO.getEid()), null, userId);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetDrawLine(DrawLineVO drawLineVO) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "放线信息不存在");
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

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int successDrawLine(DrawLineVO drawLineVO, List<ConstructionNodeVO> constructionNodes, String userId) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "放线信息不存在");
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

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionInfoPO.setCid(cid);
		constructionInfoPO.setActuaTime(drawLinePO.getActualTime());

		constructionInfoDao.update(constructionInfoPO);

		int timelimit = 0;

		for (ConstructionNodeVO constructionNodeVO : constructionNodes) {

			Timestamp drawlineTime = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + constructionNodeVO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodeVO.getCnid());

			if (constructionSchedulePO != null) {

				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);

				constructionSchedulePO.setPeriod(constructionNodeVO.getTimeLimit());

				constructionScheduleDao.update(constructionSchedulePO);
			} else {

				ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

				if (constructionNodePO == null) continue;

				constructionScheduleDao.save(new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodeVO.getTimeLimit()).init(constructionNodePO));
			}

			timelimit = timelimit + constructionNodeVO.getTimeLimit();
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
			throw new FLException(120014, "放线信息不存在");
		}

		messageService.sendMessage(drawLinePO.getDecoration().getDesigner().getUserId(), userId, (String.format("订单:%s,放线失败!请重新申请放线.", drawLinePO.getDecoration().getOrderId())), MessagePO.TYPE_SEND_CONSTRUCTION_INT, drawLinePO.getCompany());

		drawLinePO.setStatus(DrawLinePO.STATUS_FAIL_INT);

		drawLineDao.update(drawLinePO);

		return 0;
	}

}