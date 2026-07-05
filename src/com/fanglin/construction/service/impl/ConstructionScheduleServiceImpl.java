package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionScheduleDO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.customer.service.SurveyService;
import com.fanglin.customer.vo.SurveyVO;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.MessageQueuingDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructionScheduleService")
@Transactional(readOnly = true)
public class ConstructionScheduleServiceImpl implements ConstructionScheduleService {

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private SurveyService surveyService;

	@Autowired
	private MessageService messageService;

	@Autowired
	private MessageQueuingDao messageQueuingDao;

	@Override
	public void pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<ConstructionScheduleDO> constructionScheduleDOs = constructionScheduleDao.pageConstructionSchedule(paging, filters, company);
		List<ConstructionScheduleVO> constructionVOs = new ArrayList<ConstructionScheduleVO>();

		for (ConstructionScheduleDO constructionScheduleDO : constructionScheduleDOs) {
			constructionVOs.add(constructionScheduleDO.ptv(new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(new DecorationVO(), new UserBaseVO()), new DecorationVO())));
		}

		paging.setData(constructionVOs);
	}

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) {

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId());
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			constructionScheduleVOs.add(constructionSchedulePO.ptv(new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(), new DecorationVO())));
		}

		return constructionScheduleVOs;
	}

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByCid(constructionScheduleVO.getCid());
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			constructionScheduleVOs.add(constructionSchedulePO.ptv(new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(), new DecorationVO())));
		}

		return constructionScheduleVOs;
	}

	@Override
	public ConstructionScheduleVO queryConstructionScheduleByCsid(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		return constructionSchedulePO.ptv(new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(), new DecorationVO()));
	}

	@Override
	public ConstructionScheduleVO queryConstructionScheduleByOrderIdASchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = null;

		// 优先用 csid 主键查询; csid 为空时回退到 orderId + schedule (兼容旧调用方)
		if (constructionScheduleVO.getCsid() != null && constructionScheduleVO.getCsid() != 0) {
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());
		} else {
			constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionScheduleVO.getSchedule());
		}

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		return constructionSchedulePO.ptv(constructionScheduleVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionScheduleForNorm(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionScheduleVO.getSalaryLimit() > Arith.add(constructionSchedulePO.getSalaryLimit(), constructionSchedulePO.getSalaryLimitTotal())) {
			throw new FLException(120035, "工费浮动已达上限");
		}

		constructionSchedulePO.setAccessoryLimit(constructionScheduleVO.getAccessoryLimit());
		constructionSchedulePO.setSalaryLimit(constructionScheduleVO.getSalaryLimit());
		constructionSchedulePO.setAccessoryTotal(constructionScheduleVO.getAccessoryTotal());
		constructionSchedulePO.setSalaryTotal(constructionScheduleVO.getSalaryTotal());

		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionScheduleForScal(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		constructionSchedulePO.setPrecheck(constructionScheduleVO.getPrecheck());
		constructionSchedulePO.setPostcheck(constructionScheduleVO.getPostcheck());
		constructionSchedulePO.setStacheck(constructionScheduleVO.getStacheck());
		constructionSchedulePO.setFincheck(constructionScheduleVO.getFincheck());

		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionScheduleForPeriod(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		constructionSchedulePO.setPeriod(constructionScheduleVO.getPeriod());

		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int beginConstructionSchedule(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		DecorationPO decorationPO = constructionPO.getDecoration();

		ConstructionNodePO constructionNodePO = constructionSchedulePO.getNode();

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < Arith.div(constructionSchedulePO.getPrecheck(), 1000.0)) {
			throw new FLException(120018, "装修款比例不足");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getSaleScale() < Arith.div(constructionSchedulePO.getStacheck(), 1000.0)) {
			throw new FLException(120033, "销售比例不足");
		}

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_BEGIN_INT);
		constructionSchedulePO.setStartTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);

		if (constructionNodePO.getStartSurvey() != null && constructionNodePO.getStartSurvey().getStatus() == ConstructionNodePO.STATUS_INIT_SHORT) {
			surveyService.makeSurvey(new SurveyVO(constructionNodePO.getStartSurvey().getStid(), constructionPO.getDecoration().getOrderId()), userId, constructionPO.getDecoration().getCompany());
		}

		ConstructionNodePO projectStatus = constructionNodeDao.get(decorationPO.getProjectStatus());

		if (projectStatus != null && projectStatus.getSort() < constructionNodePO.getSort() && projectStatus.getSort() != DecorationPO.PROJECTSTATUS_FINISH_INT) {

			decorationPO.setProjectStatus(constructionSchedulePO.getNode().getCnid());

			decorationDao.update(decorationPO);

			constructionPO.setSchedule(constructionNodePO.getSort());
			constructionPO.setCnid(constructionNodePO.getCnid());
		}

		if (constructionNodePO.getMark() == ConstructionNodePO.MARK_START_INT) {
			constructionPO.setStartTime(DateUtil.getDateToTimestamp(new Date()));

			resetConstructionSchedule(constructionScheduleVO);
		}

		constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		constructionDao.update(constructionPO);

		decorationService.sendMessage(decorationPO.getOrderId(), "工程", String.format("%s准备进场. %s", constructionNodePO.getName(), constructionNodePO.getStartalk()));

		constructionScheduleVO.setStartTime(constructionSchedulePO.getStartTime());

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(decorationPO.getOrderId(), "beginConstructionSchedule", "{\"orderId\":\"" + decorationPO.getOrderId() + "\",\"cnid\":\"" + constructionSchedulePO.getNode().getCnid() + "\",\"status\":\"1\",\"userId\":\"" + userId + "\",\"event\":\"PROJECT_NODE_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
		messageQueuingDao.save(new MessageQueuingPO().init(decorationPO.getOrderId(), "beginConstructionSchedule", "{\"orderId\":\"" + decorationPO.getOrderId() + "\",\"cnid\":\"" + constructionSchedulePO.getNode().getCnid() + "\",\"status\":\"1\",\"userId\":\"" + userId + "\",\"event\":\"PROJECT_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishConstructionSchedule(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_BEGIN_INT) {
			throw new FLException(120025, "工程环节不可操作");
		}

		DecorationPO decorationPO = constructionPO.getDecoration();

		ConstructionNodePO constructionNodePO = constructionSchedulePO.getNode();

		if (constructionNodePO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < Arith.div(constructionSchedulePO.getPostcheck(), 1000.0)) {
			throw new FLException(120018, "装修款比例不足");
		}

		if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getSaleScale() < Arith.div(constructionSchedulePO.getFincheck(), 1000.0)) {
			throw new FLException(120033, "销售比例不足");
		}

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_FINISH_INT);
		constructionSchedulePO.setEndTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);

		if (constructionNodePO.getProcess() != ConstructionNodePO.PROCESS_INIT_INT && constructionScheduleDao.countConstructionSchedule(constructionPO.getCid(), ConstructionSchedulePO.STATUS_FINISH_INT, constructionNodePO.getProcess()) + 1 == constructionNodeDao.countConstructionNode(constructionNodePO.getProcess(), decorationPO.getCompany())) {
			constructionPO.setProcess(constructionNodePO.getProcess());
			constructionPO.setProcessTime(DateUtil.getDateToTimestamp(new Date()));
		}

		if (constructionNodePO.getMark() == ConstructionNodePO.MARK_FINISH_INT) {
			constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionDao.update(constructionPO);

		if (constructionNodePO.getEndSurvey() != null && constructionNodePO.getEndSurvey().getStatus() == ConstructionNodePO.STATUS_INIT_SHORT) {
			surveyService.makeSurvey(new SurveyVO(constructionNodePO.getEndSurvey().getStid(), constructionPO.getDecoration().getOrderId()), userId, constructionPO.getDecoration().getCompany());
		}

		decorationService.sendMessage(decorationPO.getOrderId(), "工程", String.format("%s已完工. %s", constructionNodePO.getName(), constructionNodePO.getEndtalk()));

		ConstructionInfoPO constructionInfo = constructionInfoDao.queryConstructionInfoByOrderId(decorationPO.getOrderId());

		long finishDay = 0;
		String finishTime = "无";

		if (constructionInfo != null && constructionInfo.getFinishTime() != null) {
			finishDay = Arith.div(DateUtil.getDateToTimestamp(constructionInfo.getFinishTime()).getTime() - System.currentTimeMillis(), 86400000000L);
			finishTime = DateUtil.getDateToDateString(DateUtil.getDateToTimestamp(constructionInfo.getFinishTime()), "yyyy年MM月dd日");
		}

		String content = String.format("装修单: %s, 地址: %s %s, 预计完工时间: %s , 还剩%s日 , 请及时对接完工安排 ", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()), finishTime, finishDay + 1);

		messageService.sendMessage(constructionPO.getSupervisor().getUserId(), decorationPO.getCreater().getUserId(), content, MessagePO.TYPE_SEND_CONSTRUCTION_INT, decorationPO.getCompany());

		constructionScheduleVO.setEndTime(constructionSchedulePO.getEndTime());

		// 生成消息队列数据
		messageQueuingDao.save(new MessageQueuingPO().init(decorationPO.getOrderId(), "finishConstructionSchedule", "{\"orderId\":\"" + decorationPO.getOrderId() + "\",\"cnid\":\"" + constructionSchedulePO.getNode().getCnid() + "\",\"status\":\"2\",\"userId\":\"" + userId + "\",\"event\":\"PROJECT_NODE_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int checkoutConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionScheduleVO.getCheckout() == ConstructionSchedulePO.CHECKOUT_PASS_INT) {
			constructionSchedulePO.setCheckout(ConstructionSchedulePO.CHECKOUT_PASS_INT);
		} else {
			ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

			if (constructionPO == null) {
				throw new FLException(120020, "工程信息不存在");
			}

			DecorationPO decorationPO = constructionPO.getDecoration();

			if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < Arith.div(constructionSchedulePO.getPostcheck(), 1000.0)) {
				throw new FLException(120018, "装修款比例不足");
			}

			constructionSchedulePO.setCheckout(ConstructionSchedulePO.CHECKOUT_VALID_INT);
		}

		constructionScheduleDao.update(constructionSchedulePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void enterConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getWorkStatus() == ConstructionSchedulePO.WORKSTATUS_LEAVE_INT) {
			return;
		}

		constructionSchedulePO.setWorkStatus(ConstructionSchedulePO.WORKSTATUS_ENTER_INT);
		constructionSchedulePO.setEnterTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void leaveConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getWorkStatus() == ConstructionSchedulePO.WORKSTATUS_LEAVE_INT) {
			return;
		}

		constructionSchedulePO.setWorkStatus(ConstructionSchedulePO.WORKSTATUS_LEAVE_INT);
		constructionSchedulePO.setLeaveTime(DateUtil.getDateToTimestamp(new Date()));

		constructionScheduleDao.update(constructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int resetConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		ConstructionPO constructionPO = constructionDao.get(constructionSchedulePO.getCid());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		boolean flag = false;
		int timelimit = 0;
		Timestamp startTime = constructionSchedulePO.getStartTime();

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByCid(constructionPO.getCid());
		List<ConstructionSchedulePO> constructionScheduleWOs = new ArrayList<ConstructionSchedulePO>();

		for (ConstructionSchedulePO constructionSchedule : constructionSchedulePOs) {

			if (!flag) constructionScheduleWOs.add(0, constructionSchedule);

			if (constructionSchedule.getCsid() == constructionSchedulePO.getCsid()) flag = true;

			Timestamp preStartTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(startTime), Arith.div(timelimit, 1000000)));
			Timestamp preEndTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(startTime), Arith.div((timelimit + constructionSchedule.getPeriod()), 1000000)));

			constructionSchedule.setPreStartTime(preStartTime);
			constructionSchedule.setPreEndTime(preEndTime);

			constructionScheduleDao.update(constructionSchedule);

			timelimit = timelimit + constructionSchedule.getPeriod();
		}

		timelimit = 0;

		for (ConstructionSchedulePO constructionSchedule : constructionScheduleWOs) {

			Timestamp preStartTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(startTime), Arith.div(timelimit, -1000000)));
			Timestamp preEndTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(startTime), Arith.div((timelimit + constructionSchedule.getPeriod()), -1000000)));

			constructionSchedule.setPreStartTime(preStartTime);
			constructionSchedule.setPreEndTime(preEndTime);

			constructionScheduleDao.update(constructionSchedule);

			timelimit = timelimit + constructionSchedule.getPeriod();
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void planConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		if (constructionSchedulePO.getPlanStatus() != 0) {
			throw new FLException(120025, "预估工费已确认,不可重复操作");
		}

		constructionSchedulePO.setPlanSalary(constructionScheduleVO.getPlanSalary());
		constructionSchedulePO.setPlanTime(new Timestamp(System.currentTimeMillis()));
		constructionSchedulePO.setPlanStatus(ConstructionSchedulePO.PLAN_STATUS_PLAN_INT);

		constructionScheduleDao.update(constructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		// 校验工程是否存在
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionScheduleVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		// 校验标准节点是否存在 (决策3: 从标准 node 选择, cnid 必填)
		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionScheduleVO.getNode().getCnid());

		if (constructionNodePO == null) {
			throw new FLException(120034, "工程节点不存在");
		}

		// 校验该订单是否已存在相同节点的 schedule (按 orderId + cnid 查重)
		ConstructionSchedulePO existing = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionNodePO.getCnid());

		if (existing != null) {
			throw new FLException(120036, "工程环节已存在");
		}

		// 用 node 信息初始化 schedule (schedule 字段 = node.sort 快照, 之后独立维护)
		ConstructionSchedulePO constructionSchedulePO = new ConstructionSchedulePO(constructionPO.getCid(), constructionScheduleVO.getOrderId()).init(constructionNodePO);

		constructionSchedulePO.setStatus(ConstructionSchedulePO.STATUS_INIT_INT);
		constructionSchedulePO.setCheckout(ConstructionSchedulePO.CHECKOUT_VALID_INT);
		constructionSchedulePO.setWorkStatus(ConstructionSchedulePO.WORKSTATUS_INIT_INT);

		constructionScheduleDao.save(constructionSchedulePO);

		constructionScheduleVO.setCsid(constructionSchedulePO.getCsid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteConstructionSchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsid());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		// 仅初始状态可删除 (已开工/完工的不可删)
		if (constructionSchedulePO.getStatus() != ConstructionSchedulePO.STATUS_INIT_INT) {
			throw new FLException(120030, "工程环节已开工, 不可删除");
		}

		constructionScheduleDao.deleteById(constructionSchedulePO.getCsid());
	}

}
