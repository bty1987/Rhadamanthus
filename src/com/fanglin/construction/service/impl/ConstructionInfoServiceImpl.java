package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.HousePO;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.ConstructionInfoDO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.service.ConstructionInfoService;
import com.fanglin.construction.service.ConstructionPlanService;
import com.fanglin.construction.vo.ConstructionInfoVO;
import com.fanglin.construction.vo.ConstructionPlanVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.dao.EventsDao;
import com.fanglin.information.po.EventsPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("ConstructionInfoService")
@Transactional(readOnly = true)
public class ConstructionInfoServiceImpl implements ConstructionInfoService {

	@Autowired
	private ConstructionInfoDao constructionInfoDao;

	@Autowired
	private ConstructionPlanService constructionPlanService;

	@Autowired
	private DrawLineDao drawLineDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private EventsDao eventsDao;

	@Override
	public void pageConstructionInfo(Paging paging, List<Filter> filters, ConstructionInfoVO constructionInfoVO, Integer company) throws FLException {

		if (constructionInfoVO != null && constructionInfoVO.getDecoration() != null && constructionInfoVO.getDecoration().getHouseType() != null) {
			filters.add(new Filter("decoration.houseType", constructionInfoVO.getDecoration().getHouseType(), "eq"));
		}

		if (constructionInfoVO != null && constructionInfoVO.getDecoration() != null && constructionInfoVO.getDecoration().getDesignStatus() != null) {
			filters.add(new Filter("decoration.designStatus", String.valueOf(constructionInfoVO.getDecoration().getDesignStatus()), "eq"));
		}

		if (constructionInfoVO != null && constructionInfoVO.getDrawlineTime() != null) {
			filters.add(new Filter("drawlineTimeFlag", DateUtil.getDateToDateString(DateUtil.getTimestampToDate(constructionInfoVO.getDrawlineTime()), "yyyy-MM-dd"), "eq"));
		}

		if (constructionInfoVO != null && constructionInfoVO.getIsIssue() != null) {
			filters.add(new Filter("isIssue", String.valueOf(constructionInfoVO.getIsIssue()), "eq"));
		}

		List<ConstructionInfoDO> constructionInfoDOs = constructionInfoDao.pageConstructionInfo(paging, filters, company);
		List<ConstructionInfoVO> constructionInfoVOs = new ArrayList<ConstructionInfoVO>();

		for (ConstructionInfoDO constructionInfoDO : constructionInfoDOs) {
			constructionInfoVOs.add(constructionInfoDO.ptv(new ConstructionInfoVO(new DecorationVO(new UserBaseVO()))));
		}

		paging.setData(constructionInfoVOs);
	}

	@Override
	public ConstructionInfoVO queryConstructionInfo(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfo(constructionInfoVO.getCid());

		if (constructionInfoPO != null) constructionInfoPO.ptv(constructionInfoVO);

		return constructionInfoVO;
	}

	@Override
	public ConstructionInfoVO queryConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		if (constructionInfoPO != null) constructionInfoPO.ptv(constructionInfoVO);

		return constructionInfoVO;
	}

	@Override
	public List<?> countConstructionInfo(ConstructionInfoVO constructionInfoVO, int company) {

		List<Object> ress = new ArrayList<Object>();

		Timestamp startTime = constructionInfoVO.getStartTime();
		Timestamp endTime = constructionInfoVO.getEndTime();

		long start = Long.parseLong(DateUtil.getDateToDateString(startTime, "yyyyMMdd"));
		long end = Long.parseLong(DateUtil.getDateToDateString(endTime, "yyyyMMdd"));

		ress.addAll(constructionInfoDao.countConstructionInfo(start, end, company));
		ress.addAll(drawLineDao.countDrawLineForTime(start, end, company));

		return ress;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException {

		updateConstructionInfoByOrderId(constructionInfoVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionInfoVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		if (constructionInfoPO == null) {
			constructionInfoPO = new ConstructionInfoPO();
			constructionInfoPO.setInitDesignTime(decorationPO.getContractTime());
		}

		BeanUtil.copyPropertie(constructionInfoVO, constructionInfoPO);

		if (constructionInfoPO.getInitDesignTime() == null) constructionInfoPO.setInitDesignTime(decorationPO.getContractTime());

		constructionInfoDao.saveOrUpdate(constructionInfoPO);

		constructionPlanService.makeConstructionPlan(new ConstructionPlanVO(constructionInfoVO.getOrderId()));

		if (decorationPO != null && constructionInfoVO.getDecoration() != null && constructionInfoVO.getDecoration().getConpany() != null) {

			decorationPO.setConpany(CompanyServiceImpl.decode(constructionInfoVO.getDecoration().getConpany()));

			decorationDao.update(decorationPO);
		}

		if (decorationPO != null && constructionInfoVO.getDecoration().getHouse() != null && constructionInfoVO.getDecoration().getHouse().getQuoteArea() != null) {

			HousePO housePO = decorationPO.getHouse();

			housePO.setQuoteArea(constructionInfoVO.getDecoration().getHouse().getQuoteArea());

			houseDao.update(housePO);
		}

		if (constructionInfoVO.getDrawlineTime() != null) {

			String orderId = decorationPO.getOrderId();

			String title = "放线时间提醒(10天)";
			String content = String.format("装修单: %s, 放线时间提醒(10天), %s", orderId, constructionInfoVO.getDrawlineTime());

			EventsPO eventsPO = new EventsPO().init(orderId, title, content, decorationPO.getDesigner(), EventsPO.ATTTYPE_CONSTRUCTION_DRAWING_INT);

			Timestamp drawlineTime = constructionInfoVO.getDrawlineTime();
			long day = Arith.div(DateUtil.getDateToTimestamp(drawlineTime).getTime() - System.currentTimeMillis(), 86400000000L);

			if (day > 10) {
				eventsPO.setShowDate(Integer.parseInt(DateUtil.getDateToDateString(DateUtil.plusDay(drawlineTime, -10), "yyyyMMdd")));
				eventsDao.save(eventsPO);
			}

			if (day <= 10 && day > 0) {
				eventsPO.setShowDate(Integer.parseInt(DateUtil.getDateToDateString(DateUtil.plusDay(drawlineTime, -(int) day), "yyyyMMdd")));
				eventsDao.save(eventsPO);
			}
		}

		if (constructionInfoVO.getKeyTime() != null) {

			String orderId = decorationPO.getOrderId();

			String title = "领钥匙时间提醒(10天)";
			String content = String.format("装修单: %s, 领钥匙时间提醒(10天), %s", orderId, constructionInfoVO.getKeyTime());

			EventsPO eventsPO = new EventsPO().init(orderId, title, content, decorationPO.getDesigner(), EventsPO.ATTTYPE_CONSTRUCTION_DRAWING_INT);

			Timestamp keyTime = constructionInfoVO.getKeyTime();
			long day = Arith.div(DateUtil.getDateToTimestamp(keyTime).getTime() - System.currentTimeMillis(), 86400000000L);

			if (day > 10) {
				eventsPO.setShowDate(Integer.parseInt(DateUtil.getDateToDateString(DateUtil.plusDay(keyTime, -10), "yyyyMMdd")));
				eventsDao.save(eventsPO);
			}

			if (day <= 10 && day > 0) {
				eventsPO.setShowDate(Integer.parseInt(DateUtil.getDateToDateString(DateUtil.plusDay(keyTime, -(int) day), "yyyyMMdd")));
				eventsDao.save(eventsPO);
			}

		}

		if (constructionInfoVO.getDesignTime() != null) {

			String orderId = decorationPO.getOrderId();

			String title = "设计完成时间提醒(5天)";
			String content = String.format("装修单: %s, 设计完成时间时间提醒(5天), %s", orderId, constructionInfoVO.getDesignTime());

			EventsPO eventsPO = new EventsPO().init(orderId, title, content, decorationPO.getDesigner(), EventsPO.ATTTYPE_CONSTRUCTION_DRAWING_INT);

			Timestamp designTime = constructionInfoVO.getDesignTime();
			long day = Arith.div(DateUtil.getDateToTimestamp(designTime).getTime() - System.currentTimeMillis(), 86400000000L);

			if (day > 5) {
				eventsPO.setShowDate(Integer.parseInt(DateUtil.getDateToDateString(DateUtil.plusDay(designTime, -5), "yyyyMMdd")));
				eventsDao.save(eventsPO);
			}

			if (day <= 5 && day > 0) {
				eventsPO.setShowDate(Integer.parseInt(DateUtil.getDateToDateString(DateUtil.plusDay(designTime, -(int) day), "yyyyMMdd")));
				eventsDao.save(eventsPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException {

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionInfoPO.setIsCheck(ConstructionInfoPO.ISCHECK_CHECK_INT);

		constructionInfoDao.update(constructionInfoPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void handoverConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException {

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		constructionInfoPO.setHandoverStatus(constructionInfoVO.getHandoverStatus());
		constructionInfoPO.setHandoverTime(new Timestamp(System.currentTimeMillis()));

		constructionInfoDao.update(constructionInfoPO);
	}
}
