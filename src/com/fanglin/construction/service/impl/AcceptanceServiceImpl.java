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
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
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

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

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
		acceptanceVO.setOrderAddr(decorationPO.getHouse().getVillage().getName() + " " + SensitiveDataHelper.decrypt(decorationPO.getHouse().getHouseNumber()));
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

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(acceptanceVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		SystemConfigPO limit = systemConfigDao.querySystemConfig("CONSTRUCTION_ACCEPTANCE_LIMIT_INT", decorationPO.getCompany());

		if (decorationPO.getPaySacle() < (limit != null ? Integer.parseInt(limit.getValue()) : 80)) {
			throw new FLException(120018, "装修款比例不足");
		}

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(acceptanceVO.getOrderId());

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		String orderId = decorationPO.getOrderId();

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

		decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_FINISH_INT);

		decorationDao.update(decorationPO);

		if (constructionPO.getEndTime() == null) {
			constructionPO.setEndTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		if (constructionPO.getProcess() == ConstructionPO.PROCESS_INIT_INT) {
			constructionPO.setProcess(ConstructionPO.PROCESS_FINISH_INT);
			constructionPO.setProcessTime(DateUtil.getDateToTimestamp(new Date()));
		}

		constructionDao.update(constructionPO);

		messageQueuingDao.save(new MessageQueuingPO().init(orderId, "updateAcceptance", "{\"orderId\":\"" + orderId + "\",\"status\":\"2\",\"event\":\"PROJECT_STATUS_CHANGED\"" + (constructionPO.getDecoration() != null && constructionPO.getDecoration().getBusitype() != null ? ",\"busiTypeName\":\"" + constructionPO.getDecoration().getBusitype().getName() + "\"" : "") + "}"));

		return 0;
	}
}