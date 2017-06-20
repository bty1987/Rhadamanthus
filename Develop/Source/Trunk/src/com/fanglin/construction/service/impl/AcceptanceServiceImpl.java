/**
 * @File Name		: AcceptanceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.AcceptanceDao;
import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.AcceptanceService;
import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("acceptanceService")
@Transactional(readOnly=true)
public class AcceptanceServiceImpl implements AcceptanceService{
	
	@Autowired
	private AcceptanceDao acceptanceDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private ConstructerDao constructerDao;
	
	@Override
	public AcceptanceVO queryAcceptanceById(int actId){
		
		AcceptancePO acceptancePO = acceptanceDao.get(actId);
		AcceptanceVO acceptanceVO = new AcceptanceVO();
		BeanUtil.copyProperties(acceptancePO, acceptanceVO);
		
		return acceptanceVO;
	}

	@Override
	public AcceptanceVO queryAcceptanceByOrderId(AcceptanceVO acceptanceVO){
		
		String orderId = acceptanceVO.getOrderId();
		
		AcceptancePO acceptancePO = acceptanceDao.queryAcceptanceByOrderId(orderId);
		
		BeanUtil.copyProperties(acceptancePO, acceptanceVO);
		
		acceptanceVO.setOrderId(orderId);
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		if(decorationOrderPO != null){
			acceptanceVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			acceptanceVO.setOrderAddr(decorationOrderPO.getVillagePO().getVillageName()+" "+decorationOrderPO.getHouseNumber());
			acceptanceVO.setContractCode(decorationOrderPO.getContractCode());
			acceptanceVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
		}
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		
		if(constructionSchedulePO != null){
			if(constructionSchedulePO.getSupervisorQualityId() != null){
				acceptanceVO.setSupervisName(userDao.get(constructionSchedulePO.getSupervisorQualityId()).getCurrentName());
			}
			if(constructionSchedulePO.getWaterwayCircuitPowerQualityId() != null){
				acceptanceVO.setWaterwayQualityName(userDao.get(constructionSchedulePO.getWaterwayCircuitPowerQualityId()).getCurrentName());
				acceptanceVO.setCircuitQualityName(userDao.get(constructionSchedulePO.getWaterwayCircuitPowerQualityId()).getCurrentName());
			}
			if(constructionSchedulePO.getBricklayQualityId() != null){
				acceptanceVO.setBricklayQualityName(userDao.get(constructionSchedulePO.getBricklayQualityId()).getCurrentName());
			}
			if(constructionSchedulePO.getCarpentQualityId() != null){
				acceptanceVO.setCarpentQualityName(userDao.get(constructionSchedulePO.getCarpentQualityId()).getCurrentName());
			}
			if(constructionSchedulePO.getOilQualityId() != null){
				acceptanceVO.setOilQualityName(userDao.get(constructionSchedulePO.getOilQualityId()).getCurrentName());
			}
		}
		
		List<ConstructerPO> constructerPOs = constructerDao.queryConstructerByOrderId(orderId, null);
		
		if(constructerPOs != null && constructerPOs.size() > 0){
			 for (ConstructerPO constructerPO : constructerPOs) {
				if(constructerPO.getUser().getDuty().contains("水暖工")){
					acceptanceVO.setWaterwayWorkerName(constructerPO.getUser().getUserName());
				}else if(constructerPO.getUser().getDuty().contains("电工")){
					acceptanceVO.setCircuitWorkerName(constructerPO.getUser().getUserName());
				}else if(constructerPO.getUser().getDuty().contains("瓦工")){
					acceptanceVO.setBricklayWorkerName(constructerPO.getUser().getUserName());
				}else if(constructerPO.getUser().getDuty().contains("木工")){
					acceptanceVO.setCarpentWorkerName(constructerPO.getUser().getUserName());
				}else if(constructerPO.getUser().getDuty().contains("油工")){
					acceptanceVO.setOilWorkerName(constructerPO.getUser().getUserName());
				}
			}
		}
		return acceptanceVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateAcceptance(AcceptanceVO acceptanceVO){
		
		AcceptancePO acceptancePO = acceptanceDao.queryAcceptanceByOrderId(acceptanceVO.getOrderId());
		
		if(acceptancePO == null){
			acceptancePO = new AcceptancePO();
			acceptancePO.setAcceptanceTime(DateUtil.current(AcceptancePO.CURRENT_TIME_FORMAT_STR));
		}
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(acceptanceVO.getOrderId());
		
		if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT) == 0){
			constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT);
			
			constructionScheduleDao.update(constructionSchedulePO);
		}
		
		if(acceptancePO.getAcceptanceTime() == null){
			acceptancePO.setAcceptanceTime(DateUtil.current(AcceptancePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(acceptanceVO, acceptancePO);
		
		acceptanceDao.saveOrUpdate(acceptancePO);
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(acceptanceVO.getOrderId());
		
		if(decorationOrderPO != null){
			decorationOrderPO.setProjectStatus("已完工");
			decorationOrderDao.update(decorationOrderPO);
		}
	}

}