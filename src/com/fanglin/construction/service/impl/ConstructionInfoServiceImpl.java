package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.HouseDao;
import com.fanglin.communion.po.HousePO;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoDO;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.service.ConstructionInfoService;
import com.fanglin.construction.vo.ConstructionInfoVO;
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
	private DecorationDao decorationDao;

	@Autowired
	private HouseDao houseDao;

	@Autowired
	private EventsDao eventsDao;

	@Override
	public void pageConstructionInfo(Paging paging, List<Filter> filters, Integer company) throws FLException {

		List<ConstructionInfoDO> constructionInfoDOs = constructionInfoDao.pageConstructionInfo(paging, filters, company);
		List<ConstructionInfoVO> constructionVOs = new ArrayList<ConstructionInfoVO>();

		ConstructionInfoVO constructionInfoVO;

		for (ConstructionInfoDO constructionInfoDO : constructionInfoDOs) {

			constructionInfoVO = new ConstructionInfoVO(new DecorationVO());

			constructionInfoVO.getDecoration().setSupervisor(new UserBaseVO());

			BeanUtil.copyProperties(constructionInfoDO, constructionInfoVO, Arrays.asList("decoration", "constructionPace"));

			constructionInfoDO.getDecoration().ptvcascade(constructionInfoVO.getDecoration());

			constructionVOs.add(constructionInfoVO);
		}

		paging.setData(constructionVOs);
	}

	@Override
	public ConstructionInfoVO queryConstructionInfo(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfo(constructionInfoVO.getCid());

		BeanUtil.copyPropertie(constructIoninfoPO, constructionInfoVO);

		return constructionInfoVO;
	}

	@Override
	public ConstructionInfoVO queryConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) {

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		BeanUtil.copyPropertie(constructIoninfoPO, constructionInfoVO);

		return constructionInfoVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionInfo(ConstructionInfoVO constructionInfoVO) throws FLException {

		updateConstructionInfoByOrderId(constructionInfoVO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateConstructionInfoByOrderId(ConstructionInfoVO constructionInfoVO) throws FLException {

		ConstructionInfoPO constructIoninfoPO = constructionInfoDao.queryConstructionInfoByOrderId(constructionInfoVO.getOrderId());

		if (constructIoninfoPO == null) {
			constructIoninfoPO = new ConstructionInfoPO();
		}

		BeanUtil.copyPropertie(constructionInfoVO, constructIoninfoPO);

		constructionInfoDao.saveOrUpdate(constructIoninfoPO);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(constructionInfoVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

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
}
