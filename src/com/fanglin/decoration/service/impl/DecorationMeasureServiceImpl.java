package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.vo.ConstructionNodeVO;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationMeasureDao;
import com.fanglin.decoration.po.DecorationMeasurePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationMeasureService;
import com.fanglin.decoration.vo.DecorationMeasureVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationMeasureService")
@Transactional(readOnly = true)
public class DecorationMeasureServiceImpl implements DecorationMeasureService {

	@Autowired
	private DecorationMeasureDao decorationMeasureDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Override
	public void pageDecorationMeasure(Paging paging, List<Filter> filters, DecorationMeasureVO decorationMeasure, int company) throws FLException {

		if (filters.size() == 0) return;

		List<DecorationMeasureVO> decorationMeasureVOs = new ArrayList<DecorationMeasureVO>();

		List<DecorationMeasurePO> decorationMeasurePOs = decorationMeasureDao.pageDecorationMeasure(paging, filters, company);

		for (DecorationMeasurePO decorationMeasurePO : decorationMeasurePOs) {

			decorationMeasureVOs.add(convertBean(decorationMeasurePO));

		}

		paging.setData(decorationMeasureVOs);
	}

	@Override
	public void pageDecorationMeasureForApplay(Paging paging, List<Filter> filters, DecorationMeasureVO decorationMeasure, int company) throws FLException {

		if (decorationMeasure != null && decorationMeasure.getStatus() != null) {
			filters.add(new Filter("status", String.valueOf(decorationMeasure.getStatus()), "eq"));
		}

		List<DecorationMeasureVO> decorationMeasureVOs = new ArrayList<DecorationMeasureVO>();

		List<DecorationMeasurePO> decorationMeasurePOs = decorationMeasureDao.pageDecorationMeasure(paging, filters, company);

		for (DecorationMeasurePO decorationMeasurePO : decorationMeasurePOs) {

			decorationMeasureVOs.add(convertBean(decorationMeasurePO));

		}

		paging.setData(decorationMeasureVOs);
	}

	@Override
	public void sendDecorationMeasure(DecorationMeasureVO decorationMeasureVO) throws FLException {

		String orderId = decorationMeasureVO.getDecoration().getOrderId();
		DecorationMeasurePO decorationMeasure = decorationMeasureDao.queryDecorationMeasure(orderId);

		if (decorationMeasure == null) {
			throw new FLException(140081, "装修量尺信息不存在");
		}

		System.out.println(String.format("pages/decoration/measure/measure?orderId=%s", orderId));

		decorationService.sendMessage(orderId, "装修单", "请您及时确认量尺信息", String.format("pages/decoration/measure/measure?orderId=%s", orderId));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmDecorationMeasure(DecorationVO decorationVO, DecorationMeasureVO decorationMeasureVO) throws FLException {

		String orderId = decorationMeasureVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (decorationVO.getCustomer() == null) {
			throw new FLException(130002, "客户不存在");
		}

		com.fanglin.customer.vo.DecorationVO cusDecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cusDecorationVO.setOrderId(orderId);
		cusDecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationService.queryDecoration(cusDecorationVO).getOrderId() == null) {
			throw new FLException(330017, "装修单未绑定");
		}

		if (decorationPO.getSourceStatus() >= decorationMeasureVO.getStatus()) {
			throw new FLException(140074, "装修量尺不可操作");
		}

		if (decorationPO.getSourceStatus() == DecorationPO.STATUS_INITIA_INT && decorationMeasureVO.getStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT) {
			throw new FLException(140074, "装修量尺不可操作");
		}

		UserPO designer = decorationPO.getDesigner();
		HousePO housePO = decorationPO.getHouse();
		VillagePO villagePO = housePO.getVillage();

		String houseAddr = String.format("%s %s", villagePO.getName(), housePO.getHouseNumber());

		if (decorationMeasureVO.getStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT) {

			decorationPO.setSourceStatus(decorationMeasureVO.getStatus());
			decorationPO.setDesignStatus(DecorationPO.DESIGNSTATUS_END_INT);
			decorationPO.setSdesignTime(DateUtil.getDateToTimestamp(new Date()));

			messageService.sendMessage(designer.getUserId(), null, String.format("装修单: %s , 地址: %s , 合同设计方案客户已确认通过 , 持续关注客户服务及量尺开工推进 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		if (decorationMeasureVO.getStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT) {

			decorationPO.setSourceStatus(decorationMeasureVO.getStatus());
			decorationPO.setEdesignTime(DateUtil.getDateToTimestamp(new Date()));
			messageService.sendMessage(designer.getUserId(), null, String.format("装修单: %s , 地址: %s , 量尺开工设计方案客户已确认通过 , 持续关注客户服务及对接排量尺事项安排 .", orderId, houseAddr), MessagePO.TYPE_SEND_PERSONEL_INT, designer.getCompany());
		}

		decorationDao.update(decorationPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int successDecorationMeasure(DecorationMeasureVO decorationMeasureVO, List<ConstructionNodeVO> constructionNodes, String userId) throws FLException {

		DecorationMeasurePO decorationMeasurePO = decorationMeasureDao.get(decorationMeasureVO.getDmid());

		if (decorationMeasurePO == null) {
			throw new FLException(120014, "不存在该量尺信息");
		}

		if (decorationMeasurePO.getStatus() != DecorationMeasurePO.STATUS_APPLICATION_INT) {
			throw new FLException(120017, "订单放线状态错误");
		}

		DecorationPO decorationPO = decorationMeasurePO.getDecoration();

		String orderId = decorationPO.getOrderId();

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		long cid = constructionPO.getCid();

		ConstructionInfoPO constructionInfo = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfo == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		int timelimit = 0;

		for (ConstructionNodeVO constructionNodeVO : constructionNodes) {

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(constructionInfo.getDrawlineTime()), Arith.div(timelimit, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(constructionInfo.getDrawlineTime()), Arith.div((timelimit + constructionNodeVO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodeVO.getSort(), constructionNodeVO.getTimeLimit());

			constructionSchedulePO.setNode(new ConstructionNodePO(constructionNodeVO.getCnid()));

			constructionScheduleDao.save(constructionSchedulePO);

			timelimit = timelimit + constructionNodeVO.getTimeLimit();
		}

		decorationMeasurePO.setStatus(DecorationMeasurePO.STATUS_SUCCESS_INT);

		constructionScheduleDao.update(decorationMeasurePO);

		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_INITIAL_INT) {
			decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);

			decorationDao.update(decorationPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int failureDecorationMeasure(DecorationMeasureVO decorationMeasureVO, String userId) throws FLException {

		DecorationMeasurePO decorationMeasurePO = decorationMeasureDao.get(decorationMeasureVO.getDmid());

		if (decorationMeasurePO == null) {
			throw new FLException(120014, "不存在该量尺信息");
		}

		messageService.sendMessage(decorationMeasurePO.getDecoration().getDesigner().getUserId(), userId, (String.format("订单:%s,量尺失败!请重新申请量尺.", decorationMeasurePO.getDecoration().getOrderId())), MessagePO.TYPE_SEND_CONSTRUCTION_INT, decorationMeasurePO.getCompany());

		decorationMeasurePO.setStatus(DecorationMeasurePO.STATUS_FAIL_INT);

		decorationMeasureDao.update(decorationMeasurePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationMeasure(DecorationMeasureVO decorationMeasureVO) throws FLException {

		DecorationMeasurePO decorationMeasurePO = decorationMeasureDao.get(decorationMeasureVO.getDmid());

		if (decorationMeasurePO == null) {
			throw new FLException(120014, "不存在该量尺信息");
		}

		decorationMeasurePO.setApplayTime(decorationMeasureVO.getApplayTime());
		decorationMeasurePO.setActualTime(Long.parseLong(DateUtil.getDateToDateString(decorationMeasureVO.getApplayTime(), "yyyyMMdd")));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int applayDecorationMeasure(DecorationMeasureVO decorationMeasureVO) throws FLException {

		DecorationMeasurePO decorationMeasurePO = decorationMeasureDao.get(decorationMeasureVO.getDmid());

		if (decorationMeasurePO == null) {
			throw new FLException(120014, "不存在该量尺信息");
		}

		Timestamp start = decorationMeasureVO.getStartTime();
		Timestamp end = decorationMeasureVO.getEndTime();

		if (decorationMeasureDao.countDecorationMeasure(start, end, decorationMeasurePO.getCompany()) > 0) {
			throw new FLException(120015, "时间重叠不能申请放线计划");
		}

		decorationMeasurePO.setStatus(DecorationMeasurePO.STATUS_APPLICATION_INT);
		decorationMeasurePO.setEndTime(end);
		decorationMeasurePO.setStartTime(start);

		decorationMeasureDao.update(decorationMeasurePO);

		return 1;
	}

	public DecorationMeasureVO convertBean(DecorationMeasurePO decorationMeasurePO) {

		DecorationMeasureVO decorationMeasureVO = new DecorationMeasureVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(decorationMeasurePO, decorationMeasureVO, Arrays.asList("decoration", "appler", "group", "drawer"));

		if (decorationMeasurePO.getDecoration() != null) {

			decorationMeasurePO.getDecoration().ptvcascade(decorationMeasureVO.getDecoration());

			if (decorationMeasurePO.getDecoration().getSupervisor() != null) {
				decorationMeasureVO.getDecoration().setSupervisor(new UserBaseVO());
				decorationMeasureVO.getDecoration().getSupervisor().setBaseInfo(decorationMeasurePO.getDecoration().getSupervisor());
			}
		}

		if (decorationMeasurePO.getAppler() != null) {
			decorationMeasureVO.getAppler().setBaseInfo(decorationMeasurePO.getAppler());
		}

		if (decorationMeasurePO.getMeasurer() != null) {
			decorationMeasureVO.getMeasurer().setBaseInfo(decorationMeasurePO.getMeasurer());
		}

		return decorationMeasureVO;

	}
}
