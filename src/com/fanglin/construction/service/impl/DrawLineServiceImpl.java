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
import com.fanglin.customer.dao.CustomerChanceDao;
import com.fanglin.customer.po.CustomerChancePO;
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
import com.fanglin.information.po.MessageCueuingPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
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
	private CustomerChanceDao customerChanceDao;

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
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private com.fanglin.dingding.service.DingTalkMessageService dingTalkMessageService;

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

		SystemConfigPO designFlag = systemConfigDao.querySystemConfig("DESIGN_STATUS_CHECK_INT", decorationPO.getCompany());

		if (designFlag == null && decorationPO.getDesignStatus() != DecorationPO.DESIGNSTATUS_END_INT) {
			// throw new FLException(140092, "装修设计状态不可操作");
		}

		String orderId = decorationPO.getOrderId();

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		if (constructionPO == null) {

			constructionPO = new ConstructionPO(decorationPO);

			ConstructionCostPO constructionCostPO = constructionCostDao.queryConstructionCost(decorationPO.getHouse().getBuildArea(), decorationPO.getCompany());

			SystemConfigPO accessoryLimit = systemConfigDao.querySystemConfig("accessoryLimit", decorationPO.getCompany());
			SystemConfigPO salaryLimit = systemConfigDao.querySystemConfig("salaryLimit", decorationPO.getCompany());

			if (constructionCostPO == null) {
				constructionPO.setAccessoryLimit(accessoryLimit == null ? ConstructionCostPO.ACCESSORY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
				constructionPO.setSalaryLimit(salaryLimit == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimit.getValue()));
				constructionPO.setSalaryLimitTotal(salaryLimitTotal == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimitTotal.getValue()));
			} else {
				constructionPO.setAccessoryLimit(constructionCostPO.getAccessory());
				constructionPO.setSalaryLimit(constructionCostPO.getSalary());
				constructionPO.setSalaryLimitTotal(constructionCostPO.getSalary());
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

			messageQueuingDao.save(new MessageCueuingPO().init(orderId, "beginConstruction", "{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"event\":\"PROJECT_STATUS_CHANGED\"" + (constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? ",\"busiTypeName\":\"" + constructionPO.getDecoration().getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));
		}

		if (drawLineVO.getDecoration() != null && drawLineVO.getDecoration().getSupervisor() != null && drawLineVO.getDecoration().getSupervisor().getUserId() != null) {

			UserPO supervisor = userDao.queryUserByUserId(drawLineVO.getDecoration().getSupervisor().getUserId());

			if (supervisor == null) {
				throw new FLException(120021, "施工人员不存在");
			}

			constructionRecordDao.save(new ConstructionRecordPO().init(constructionPO.getDecoration().getOrderId(), constructionPO.getCid(), operater, ConstructionRecordPO.TYPE_COMMON_INT, String.format("更换监理, 原监理: %s(%s), 现监理: %s(%s)", decorationPO.getSupervisor() != null ? decorationPO.getSupervisor().getCurrentName() : "-", decorationPO.getSupervisor() != null ? decorationPO.getSupervisor().getUserId() : "-", supervisor.getCurrentName(), supervisor.getUserId())));

			constructionPO.setSupervisor(supervisor);
			decorationPO.setSupervisor(supervisor);

			decorationDao.update(decorationPO);

			constructionInfoPO.setIsIssue(ConstructionInfoPO.ISISSUE_ISSUE_INT);
			constructionInfoPO.setIssueTime(DateUtil.getDateToTimestamp(new Date()));

			constructionInfoDao.update(constructionInfoPO);
		}

		constructionDao.save(constructionPO);

		constructionDao.flush();

		long cid = constructionPO.getCid();

		int timelimit = 0;

		Timestamp drawlineTime = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

		for (ConstructionNodeVO constructionNodeVO : constructionNodeVOs) {

			if (constructionNodeVO.getTimeLimit() == null) constructionNodeVO.setTimeLimit(0);

			int prenum = constructionNodeVO.getPrenum() != null ? constructionNodeVO.getPrenum() : 0;
			int postnum = constructionNodeVO.getPostnum() != null ? constructionNodeVO.getPostnum() : 0;

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit + prenum, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + prenum - 1000 + constructionNodeVO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodeVO.getCnid());

			if (constructionSchedulePO != null) {

				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);

				constructionSchedulePO.setPrenum(prenum);
				constructionSchedulePO.setPostnum(postnum);

				constructionSchedulePO.setPeriod((constructionNodeVO.getTimeLimit() != null ? constructionNodeVO.getTimeLimit() : 0));

				constructionScheduleDao.update(constructionSchedulePO);
			} else {

				ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

				if (constructionNodePO == null) continue;

				constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodeVO.getTimeLimit(), prenum, postnum).init(constructionNodePO);

				constructionSchedulePO.setSalaryLimitTotal(salaryLimitTotal == null ? 5000000 : Integer.valueOf(salaryLimitTotal.getValue()));

				constructionScheduleDao.save(constructionSchedulePO);
			}

			timelimit = timelimit + prenum + (constructionNodeVO.getTimeLimit() != null ? constructionNodeVO.getTimeLimit() : 0) + postnum;

			constructionPO.setPreStartTime(drawlineTime);
			constructionPO.setPreEndTime(endTime);
			constructionPO.setPeriod(DateUtil.diffDay(drawlineTime, endTime));
		}

		constructionDao.update(constructionPO);

		// 推送钉钉消息给监理
		if (constructionPO.getSupervisor() != null && constructionPO.getSupervisor().getUserId() != null) {

			String supervisorId = constructionPO.getSupervisor().getUserId();
			String busiTypeName = constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? constructionPO.getDecoration().getBusitype().getName() : "-";
			String operatorName = operater != null ? operater.getCurrentName() : "-";

			String dingtalkMessage = String.format("【放线预处理通知】\n订单号: %s\n业务类型: %s\n操作人: %s\n说明: 该订单已完成放线预处理，请关注后续放线安排。", decorationPO.getOrderId(), busiTypeName, operatorName);

			dingTalkMessageService.sendDing(supervisorId, dingtalkMessage, decorationPO.getCompany());
		}

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "pretreatDrawLine", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"SUPERVISOR_PRE_ASSIGNED\"" + (constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? ",\"busiTypeName\":\"" + constructionPO.getDecoration().getBusitype().getName() + "\"" : "") + "}"));
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "pretreatDrawLine", "{\"orderId\":\"" + orderId + "\",\"userId\":\"" + userId + "\",\"event\":\"TEAM_SUPERVISOR_CHANGED\"" + (constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? ",\"busiTypeName\":\"" + constructionPO.getDecoration().getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int applayDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		String orderId = drawLineVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
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
		drawLinePO.setActualTime(Long.parseLong(DateUtil.getDateToDateString(drawLineVO.getApplayTime(), "yyyyMMdd")));
		drawLinePO.setContent(drawLineVO.getContent());
		drawLinePO.setCompany(decorationPO.getCompany());

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO != null) {
			drawLinePO.setContent(String.format("%s %s", drawLinePO.getContent(), constructionInfoPO.getComment()));
		}

		drawLineDao.save(drawLinePO);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			constructionPO = new ConstructionPO(decorationPO);

			messageQueuingDao.save(new MessageCueuingPO().init(orderId, "beginConstruction", "{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"event\":\"PROJECT_STATUS_CHANGED\"" + (constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? ",\"busiTypeName\":\"" + constructionPO.getDecoration().getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));
		}

		ConstructionCostPO constructionCostPO = constructionCostDao.queryConstructionCost(drawLinePO.getDecoration().getHouse().getBuildArea(), decorationPO.getCompany());

		SystemConfigPO accessoryLimit = systemConfigDao.querySystemConfig("accessoryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimit = systemConfigDao.querySystemConfig("salaryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		long ccid = 0;

		if (constructionCostPO == null) {
			constructionPO.setAccessoryLimit(accessoryLimit == null ? ConstructionCostPO.ACCESSORY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
			constructionPO.setSalaryLimit(salaryLimit == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimit.getValue()));
			constructionPO.setSalaryLimitTotal(salaryLimitTotal == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimitTotal.getValue()));
		} else {
			constructionPO.setAccessoryLimit(constructionCostPO.getAccessory());
			constructionPO.setSalaryLimit(constructionCostPO.getSalary());
			constructionPO.setSalaryLimitTotal(constructionCostPO.getSalary());

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
			throw new FLException(120016, "放线小组不存在");
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
		drawLinePO.setActualTime(Long.parseLong(DateUtil.getDateToDateString(end, "yyyyMMdd")));

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

		constructionInfoDao.update(constructionInfoPO);

		int timelimit = 0;

		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		for (ConstructionNodeVO constructionNodeVO : constructionNodes) {

			if (constructionNodeVO.getTimeLimit() == null) constructionNodeVO.setTimeLimit(0);

			Timestamp drawlineTime = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

			int prenum = constructionNodeVO.getPrenum() != null ? constructionNodeVO.getPrenum() : 0;
			int postnum = constructionNodeVO.getPostnum() != null ? constructionNodeVO.getPostnum() : 0;

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit + prenum, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + prenum - 1000 + constructionNodeVO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodeVO.getCnid());

			if (constructionSchedulePO != null) {

				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);
				constructionSchedulePO.setPrenum(prenum);
				constructionSchedulePO.setPostnum(postnum);

				constructionSchedulePO.setPeriod(constructionNodeVO.getTimeLimit() != null ? constructionNodeVO.getTimeLimit() : 0);

				constructionScheduleDao.update(constructionSchedulePO);
			} else {

				ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

				if (constructionNodePO == null) continue;

				constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodeVO.getTimeLimit(), prenum, postnum).init(constructionNodePO);

				constructionSchedulePO.setSalaryLimitTotal(salaryLimitTotal == null ? 5000000 : Integer.valueOf(salaryLimitTotal.getValue()));

				constructionScheduleDao.save(constructionSchedulePO);
			}

			timelimit = timelimit + prenum + (constructionNodeVO.getTimeLimit() != null ? constructionNodeVO.getTimeLimit() : 0) + postnum;

			constructionPO.setPreStartTime(drawlineTime);
			constructionPO.setPreEndTime(endTime);
			constructionPO.setPeriod(DateUtil.diffDay(drawlineTime, endTime));
		}

		constructionDao.update(constructionPO);

		drawLinePO.setStatus(DrawLinePO.STATUS_SUCCESS_INT);

		drawLineDao.update(drawLinePO);

		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_INITIAL_INT) {
			decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);

			decorationDao.update(decorationPO);
		}

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "successDrawLine", "{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"userId\":\"" + userId + "\",\"event\":\"SNAPLINE_DONE\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int failureDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());

		if (drawLinePO == null) {
			throw new FLException(120014, "放线信息不存在");
		}

		messageService.sendMessage(drawLinePO.getDecoration().getDesigner().getUserId(), userId, (String.format("装修单:%s,放线失败!请重新申请放线.", drawLinePO.getDecoration().getOrderId())), MessagePO.TYPE_SEND_CONSTRUCTION_INT, drawLinePO.getCompany());

		drawLinePO.setStatus(DrawLinePO.STATUS_FAIL_INT);

		drawLineDao.update(drawLinePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishDrawLine(DrawLineVO drawLineVO, List<ConstructionNodeVO> constructionNodes, String userId) throws FLException {

		// 直接查询装修单和工程信息，不判断放线状态
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(drawLineVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "装修不存在");
		}

		String orderId = decorationPO.getOrderId();

		// 创建放线记录
		DrawLinePO drawLinePO = drawLineDao.queryDrawLineByOrderId(orderId);
		Timestamp drawlineTime = drawLineVO.getApplayTime() != null ? drawLineVO.getApplayTime() : DateUtil.getDateToTimestamp(new Date());

		if (drawLinePO == null) {
			drawLinePO = new DrawLinePO();
			drawLinePO.setCount(0);
			drawLinePO.setApplayTime(drawlineTime);
			drawLinePO.setDecoration(decorationPO);
			drawLinePO.setStatus(DrawLinePO.STATUS_SUCCESS_INT);
			drawLinePO.setActualTime(Long.parseLong(DateUtil.getDateToDateString(drawlineTime, "yyyyMMdd")));
			drawLinePO.setContent("放线完成");
			drawLinePO.setCompany(decorationPO.getCompany());

			drawLineDao.save(drawLinePO);
		} else {
			// 更新现有放线记录状态为成功
			drawLinePO.setStatus(DrawLinePO.STATUS_SUCCESS_INT);
			drawLinePO.setStartTime(drawlineTime);
			drawLinePO.setEndTime(drawlineTime);
			drawLineDao.update(drawLinePO);
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			constructionPO = new ConstructionPO(decorationPO);

			messageQueuingDao.save(new MessageCueuingPO().init(orderId, "beginConstruction", "{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"event\":\"PROJECT_STATUS_CHANGED\"" + (constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? ",\"busiTypeName\":\"" + constructionPO.getDecoration().getBusitype().getName() + "\"" : "") + buildCcidArgs(orderId) + "}"));
		}

		ConstructionCostPO constructionCostPO = constructionCostDao.queryConstructionCost(decorationPO.getHouse().getBuildArea(), decorationPO.getCompany());

		SystemConfigPO accessoryLimit = systemConfigDao.querySystemConfig("accessoryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimit = systemConfigDao.querySystemConfig("salaryLimit", decorationPO.getCompany());
		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		if (constructionCostPO == null) {
			constructionPO.setAccessoryLimit(accessoryLimit == null ? ConstructionCostPO.ACCESSORY_DEFAULT_LONG : Long.valueOf(accessoryLimit.getValue()));
			constructionPO.setSalaryLimit(salaryLimit == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimit.getValue()));
			constructionPO.setSalaryLimitTotal(salaryLimitTotal == null ? ConstructionCostPO.SALARY_DEFAULT_LONG : Long.valueOf(salaryLimitTotal.getValue()));
		} else {
			constructionPO.setAccessoryLimit(constructionCostPO.getAccessory());
			constructionPO.setSalaryLimit(constructionCostPO.getSalary());
			constructionPO.setSalaryLimitTotal(constructionCostPO.getSalary());
		}

		constructionPO.setStartTime(DateUtil.getDateToTimestamp(new Date()));
		constructionPO.setCreateTime((DateUtil.getDateToTimestamp(new Date())));

		ConstructionPeriodPO constructionPeriodPO = constructionPeriodDao.queryConstructionPeriod(decorationPO.getHouse().getInnerArea(), decorationPO.getCompany());

		if (constructionPeriodPO != null) {
			constructionPO.setPeriod(constructionPeriodPO.getPeriod());
		}

		constructionDao.saveOrUpdate(constructionPO);

		constructionDao.flush();

		long cid = constructionPO.getCid();

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionInfoPO.setCid(cid);

		constructionInfoDao.update(constructionInfoPO);

		int timelimit = 0;

		for (ConstructionNodeVO constructionNodeVO : constructionNodes) {

			if (constructionNodeVO.getTimeLimit() == null) constructionNodeVO.setTimeLimit(0);

			Timestamp drawlineTime1 = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

			int prenum = constructionNodeVO.getPrenum() != null ? constructionNodeVO.getPrenum() : 0;
			int postnum = constructionNodeVO.getPostnum() != null ? constructionNodeVO.getPostnum() : 0;

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime1), Arith.div(timelimit + prenum, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime1), Arith.div((timelimit + prenum - 1000 + constructionNodeVO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodeVO.getCnid());

			if (constructionSchedulePO != null) {

				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);
				constructionSchedulePO.setPrenum(prenum);
				constructionSchedulePO.setPostnum(postnum);

				constructionSchedulePO.setPeriod(constructionNodeVO.getTimeLimit() != null ? constructionNodeVO.getTimeLimit() : 0);

				constructionScheduleDao.update(constructionSchedulePO);
			} else {

				ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionNodeVO.getCnid());

				if (constructionNodePO == null) continue;

				constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodeVO.getTimeLimit(), prenum, postnum).init(constructionNodePO);

				constructionSchedulePO.setSalaryLimitTotal(salaryLimitTotal == null ? 5000000 : Integer.valueOf(salaryLimitTotal.getValue()));

				constructionScheduleDao.save(constructionSchedulePO);
			}

			timelimit = timelimit + prenum + (constructionNodeVO.getTimeLimit() != null ? constructionNodeVO.getTimeLimit() : 0) + postnum;

			constructionPO.setPreStartTime(drawlineTime1);
			constructionPO.setPreEndTime(endTime);
			constructionPO.setPeriod(DateUtil.diffDay(drawlineTime1, endTime));
		}

		// 生成消息队列数据（DRAWLINE_FINISHED 事件）
		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "finishDrawLine", "{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"userId\":\"" + userId + "\",\"event\":\"DRAWLINE_FINISHED\"" + (decorationPO.getBusitype() != null ? ",\"busitypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	private String buildCcidArgs(String orderId) {

		if (orderId == null) return "";

		CustomerChancePO customerChancePO = customerChanceDao.queryCustomerChance(orderId);

		return customerChancePO != null ? ",\"ccid\":" + customerChancePO.getCcid() : "";
	}
}
