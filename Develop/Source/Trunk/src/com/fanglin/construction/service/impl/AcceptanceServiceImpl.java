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
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.construction.po.ConstructionPO;
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
	private ConstructionDao constructionDao;
	
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
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);
		
		if(constructionPO != null){
			if(constructionPO.getSupervisorQualityId() != null && !constructionPO.getSupervisorQualityId().equals("")){
				acceptanceVO.setSupervisName(userDao.queryUserByUserId(constructionPO.getSupervisorQualityId()).getCurrentName());
			}
			if(constructionPO.getWaterwayCircuitPowerQualityId() != null && !constructionPO.getWaterwayCircuitPowerQualityId().equals("")){
				acceptanceVO.setWaterwayQualityName(userDao.queryUserByUserId(constructionPO.getWaterwayCircuitPowerQualityId()).getCurrentName());
				acceptanceVO.setCircuitQualityName(userDao.queryUserByUserId(constructionPO.getWaterwayCircuitPowerQualityId()).getCurrentName());
			}
			if(constructionPO.getBricklayQualityId() != null && !constructionPO.getBricklayQualityId().equals("")){
				acceptanceVO.setBricklayQualityName(userDao.queryUserByUserId(constructionPO.getBricklayQualityId()).getCurrentName());
			}
			if(constructionPO.getCarpentQualityId() != null && !constructionPO.getCarpentQualityId().equals("")){
				acceptanceVO.setCarpentQualityName(userDao.queryUserByUserId(constructionPO.getCarpentQualityId()).getCurrentName());
			}
			if(constructionPO.getOilQualityId() != null && !constructionPO.getOilQualityId().equals("")){
				acceptanceVO.setOilQualityName(userDao.queryUserByUserId(constructionPO.getOilQualityId()).getCurrentName());
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
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(acceptanceVO.getOrderId());
		
		if(constructionPO != null && (constructionPO.getAllocationWorkerFlag() & AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT) == 0){
			constructionPO.setAllocationWorkerFlag(constructionPO.getAllocationWorkerFlag() + AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT);
			
			constructionDao.update(constructionPO);
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