/**
 * @File Name	: AcceptanceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.AcceptanceDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.AcceptanceService;
import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("acceptanceService")
@Transactional(readOnly = true)
public class AcceptanceServiceImpl implements AcceptanceService {

	@Autowired
	private AcceptanceDao acceptanceDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Override
	public AcceptanceVO queryAcceptanceById(AcceptanceVO acceptanceVO) {

		AcceptancePO acceptancePO = acceptanceDao.get(acceptanceVO.getActId());

		BeanUtil.copyProperties(acceptancePO, acceptanceVO);

		return acceptanceVO;
	}

	@Override
	public AcceptanceVO queryAcceptanceByOrderId(AcceptanceVO acceptanceVO) throws FLException {

		String orderId = acceptanceVO.getOrderId();

		AcceptancePO acceptancePO = acceptanceDao.queryAcceptanceByOrderId(orderId);

		BeanUtil.copyProperties(acceptancePO, acceptanceVO);

		acceptanceVO.setOrderId(orderId);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		acceptanceVO.setCustomer(decorationPO.getCustomer().getName());
		acceptanceVO.setOrderAddr(decorationPO.getHouse().getVillage().getName() + " " + decorationPO.getHouse().getHouseNumber());
		acceptanceVO.setDesigner(decorationPO.getDesigner().getCurrentName());

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionPO.getSupervisor() != null) {
			acceptanceVO.setSupervisName(constructionPO.getSupervisor().getCurrentName());
		}

		return acceptanceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAcceptance(AcceptanceVO acceptanceVO) throws FLException {

		AcceptancePO acceptancePO = acceptanceDao.queryAcceptanceByOrderId(acceptanceVO.getOrderId());

		if (acceptancePO == null) {
			acceptancePO = new AcceptancePO();
			acceptancePO.setAcceptanceTime(DateUtil.current(AcceptancePO.CURRENT_TIME_FORMAT_STR));
		}

		if (acceptancePO.getAcceptanceTime() == null) {
			acceptancePO.setAcceptanceTime(DateUtil.current(AcceptancePO.CURRENT_TIME_FORMAT_STR));
		}

		BeanUtil.copyProperties(acceptanceVO, acceptancePO);

		acceptanceDao.saveOrUpdate(acceptancePO);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(acceptanceVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_FINISH_INT);
		decorationDao.update(decorationPO);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(acceptanceVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		if (constructionPO.getEndTime() == null) {
			constructionPO.setEndTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		if (constructionPO.getProcess() == ConstructionPO.PROCESS_INIT_INT) {
			constructionPO.setProcess(ConstructionPO.PROCESS_FINISH_INT);
			constructionPO.setProcessTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionDao.update(constructionPO);

		return 0;
	}

}