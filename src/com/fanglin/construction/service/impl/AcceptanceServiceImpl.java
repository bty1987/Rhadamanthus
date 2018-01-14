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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.AcceptanceDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.AcceptanceService;
import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("acceptanceService")
@Transactional(readOnly=true)
public class AcceptanceServiceImpl implements AcceptanceService{
	
	@Autowired
	private AcceptanceDao acceptanceDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ConstructionDao constructionDao;
	
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
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO != null){
			acceptanceVO.setCustomer(decorationPO.getCustomer().getName());
			acceptanceVO.setOrderAddr(decorationPO.getHouse().getVillage().getName()+" "+decorationPO.getHouse().getHouseNumber());
			acceptanceVO.setContractCode(decorationPO.getContractCode());
			acceptanceVO.setDesigner(decorationPO.getDesigner().getCurrentName());
		}
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);
		
		if(constructionPO != null){
			if(constructionPO.getSupervisorQualityId() != null && !constructionPO.getSupervisorQualityId().equals("")){
				acceptanceVO.setSupervisName(userDao.queryUserByUserId(constructionPO.getSupervisorQualityId()).getCurrentName());
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
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(acceptanceVO.getOrderId());
		
		if(decorationPO != null){
			decorationPO.setProjectStatus("已完工");
			decorationDao.update(decorationPO);
		}
	}

}