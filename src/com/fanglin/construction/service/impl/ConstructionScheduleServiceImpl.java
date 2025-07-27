package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
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

	@Override
	public void pageConstructionSchedule(Paging paging, List<Filter> filters, Integer company) throws FLException {

		if (filters.size() == 0) return;

		List<ConstructionScheduleDO> constructionScheduleDOs = constructionScheduleDao.pageConstructionSchedule(paging, filters, company);
		List<ConstructionScheduleVO> constructionVOs = new ArrayList<ConstructionScheduleVO>();

		ConstructionScheduleVO constructionScheduleVO;

		for (ConstructionScheduleDO constructionScheduleDO : constructionScheduleDOs) {

			constructionScheduleVO = new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(), new DecorationVO());

			BeanUtil.copyProperties(constructionScheduleDO, constructionScheduleVO, Arrays.asList("decoration", "construction"));

			BeanUtil.copyProperties(ptv(constructionScheduleDO.getDecoration()), constructionScheduleVO.getDecoration());
			BeanUtil.copyProperties(constructionScheduleDO.getConstruction(), constructionScheduleVO.getConstruction(), Arrays.asList("decoration", "supervisor", "locker"));

			constructionScheduleVO.setCid(constructionScheduleDO.getConstruction().getCid());
			constructionScheduleVO.setOrderId(constructionScheduleDO.getDecoration().getOrderId());

			constructionVOs.add(constructionScheduleVO);
		}

		paging.setData(constructionVOs);
	}

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) {

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId());
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {

			constructionScheduleVO = new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(), new DecorationVO());

			BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO, Arrays.asList("decoration", "construction"));

			ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionSchedulePO.getCnid());

			BeanUtil.copyPropertie(constructionNodePO, constructionScheduleVO.getNode(), Arrays.asList("startSurvey", "endSurvey"));

			constructionScheduleVOs.add(constructionScheduleVO);
		}

		return constructionScheduleVOs;
	}

	@Override
	public List<ConstructionScheduleVO> queryConstructionScheduleByCid(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByCid(constructionScheduleVO.getCid());
		List<ConstructionScheduleVO> constructionScheduleVOs = new ArrayList<ConstructionScheduleVO>();

		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {

			constructionScheduleVO = new ConstructionScheduleVO(new ConstructionNodeVO(), new ConstructionVO(), new DecorationVO());

			BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO, Arrays.asList("decoration", "construction"));

			ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionSchedulePO.getCnid());

			BeanUtil.copyPropertie(constructionNodePO, constructionScheduleVO.getNode(), Arrays.asList("startSurvey", "endSurvey"));

			constructionScheduleVOs.add(constructionScheduleVO);
		}

		return constructionScheduleVOs;
	}

	@Override
	public ConstructionScheduleVO queryConstructionScheduleByOrderIdASchedule(ConstructionScheduleVO constructionScheduleVO) throws FLException {

		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId(), constructionScheduleVO.getSchedule());

		if (constructionSchedulePO == null) {
			throw new FLException(120024, "工程环节不存在");
		}

		BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO, Arrays.asList("decoration", "construction"));

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionSchedulePO.getCnid());

		BeanUtil.copyPropertie(constructionNodePO, constructionScheduleVO.getNode(), Arrays.asList("startSurvey", "endSurvey"));

		return constructionScheduleVO;
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

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionSchedulePO.getCnid());

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

			decorationPO.setProjectStatus(constructionSchedulePO.getCnid());

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

		ConstructionNodePO constructionNodePO = constructionNodeDao.get(constructionSchedulePO.getCnid());

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

		String content = String.format("装修单: %s, 地址: %s %s, 预计完工时间: %s , 还剩%s日 , 请及时对接完工安排 ", decorationPO.getOrderId(), decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber(), finishTime, finishDay + 1);

		messageService.sendMessage(constructionPO.getSupervisor().getUserId(), decorationPO.getCreater().getUserId(), content, MessagePO.TYPE_SEND_CONSTRUCTION_INT, decorationPO.getCompany());

		constructionScheduleVO.setEndTime(constructionSchedulePO.getEndTime());

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

			long cnid = constructionSchedulePO.getCnid();

			DecorationPO decorationPO = constructionPO.getDecoration();
			ConstructionNodePO constructionNodePO = constructionNodeDao.get(cnid);

			if (constructionSchedulePO.getCheckout() == ConstructionSchedulePO.CHECKOUT_VALID_INT && decorationPO.getPaySacle() < Arith.div(constructionNodePO.getPostcheck(), 1000.0)) {
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

	private DecorationVO ptv(DecorationPO decorationPO) {

		DecorationVO decorationVO = new DecorationVO();

		decorationVO.setSupervisor(new UserBaseVO());

		decorationPO.ptvcascade(decorationVO);

		return decorationVO;
	}

}
