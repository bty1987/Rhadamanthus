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
import com.fanglin.construction.dao.BricklayConstructionScheduleDao;
import com.fanglin.construction.dao.BricklayConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.CarpentConstructionScheduleDao;
import com.fanglin.construction.dao.CarpentConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.OilConstructionScheduleDao;
import com.fanglin.construction.dao.OilConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleWorkerDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.BricklayConstructionScheduleWorkerPO;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.po.CarpentConstructionScheduleWorkerPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionScheduleWorkerPO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.construction.service.AcceptanceService;
import com.fanglin.construction.vo.AcceptanceVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
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
	private WaterwayCircuitPowerConstructionScheduleDao waterwayCircuitPowerConstructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleWorkerDao waterwayCircuitPowerConstructionScheduleWorkerDao;
	
	@Autowired
	private BricklayConstructionScheduleDao bricklayConstructionScheduleDao;
	
	@Autowired
	private BricklayConstructionScheduleWorkerDao bricklayConstructionScheduleWorkerDao;
	
	@Autowired
	private CarpentConstructionScheduleDao carpentConstructionScheduleDao;
	
	@Autowired
	private CarpentConstructionScheduleWorkerDao carpentConstructionScheduleWorkerDao;
	
	@Autowired
	private OilConstructionScheduleDao oilConstructionScheduleDao;
	
	@Autowired
	private OilConstructionScheduleWorkerDao oilConstructionScheduleWorkerDao;
	
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
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		if(decorationOrderPO != null){
			acceptanceVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			acceptanceVO.setOrderAddr(decorationOrderPO.getVillagePO().getVillageName()+" "+decorationOrderPO.getHouseNumber());
			acceptanceVO.setContractCode(decorationOrderPO.getContractCode());
			acceptanceVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
		}
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		if(constructionSchedulePO != null){
			acceptanceVO.setSupervisName(userDao.get(constructionSchedulePO.getSupervisorQualityId()).getCurrentName());
			acceptanceVO.setWaterwayQualityName(userDao.get(constructionSchedulePO.getWaterwayCircuitPowerQualityId()).getCurrentName());
			acceptanceVO.setCircuitQualityName(userDao.get(constructionSchedulePO.getWaterwayCircuitPowerQualityId()).getCurrentName());
			acceptanceVO.setBricklayQualityName(userDao.get(constructionSchedulePO.getBricklayQualityId()).getCurrentName());
			acceptanceVO.setCarpentQualityName(userDao.get(constructionSchedulePO.getCarpentQualityId()).getCurrentName());
			acceptanceVO.setOilQualityName(userDao.get(constructionSchedulePO.getOilQualityId()).getCurrentName());
		}
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByOrderId(acceptanceVO.getOrderId());
		if(waterwayCircuitPowerConstructionSchedulePO != null){
			List<WaterwayCircuitPowerConstructionScheduleWorkerPO> waterwayCircuitPowerConstructionScheduleWorkerPOs = waterwayCircuitPowerConstructionScheduleWorkerDao.queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsId(waterwayCircuitPowerConstructionSchedulePO.getWcpcsId());
			
			for(WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO: waterwayCircuitPowerConstructionScheduleWorkerPOs){
				UserPO userPO = userDao.get(waterwayCircuitPowerConstructionScheduleWorkerPO.getWorkerId());
				if(userPO.getDuty().contains("水暖工")){
					acceptanceVO.setWaterwayWorkerName(userDao.get(waterwayCircuitPowerConstructionScheduleWorkerPO.getWorkerId()).getCurrentName());
				}else if(userPO.getDuty().contains("电工")){
					acceptanceVO.setCircuitWorkerName(userDao.get(waterwayCircuitPowerConstructionScheduleWorkerPO.getWorkerId()).getCurrentName());
				}
			}
		}
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByOrderId(orderId);
		if(bricklayConstructionSchedulePO != null){
			List<BricklayConstructionScheduleWorkerPO> bricklayConstructionScheduleWorkerPOs = bricklayConstructionScheduleWorkerDao.queryBricklayConstructionScheduleWorkerByBcsId(bricklayConstructionSchedulePO.getBcsId());
			if(bricklayConstructionScheduleWorkerPOs.size() > 0){
				acceptanceVO.setBricklayWorkerName(userDao.get(bricklayConstructionScheduleWorkerPOs.get(0).getWorkerId()).getCurrentName());
			}
		}
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByOrderId(orderId);
		if(carpentConstructionSchedulePO != null){
			List<CarpentConstructionScheduleWorkerPO> carpentConstructionScheduleWorkerPOs = carpentConstructionScheduleWorkerDao.queryCarpentConstructionScheduleWorkerByCcsId(carpentConstructionSchedulePO.getCcsId());
			if(carpentConstructionScheduleWorkerPOs.size() > 0){
				acceptanceVO.setCarpentWorkerName(userDao.get(carpentConstructionScheduleWorkerPOs.get(0).getWorkerId()).getCurrentName());
			}
		}
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		if(oilConstructionSchedulePO != null){
			List<OilConstructionScheduleWorkerPO> oilConstructionScheduleWorkerPOs = oilConstructionScheduleWorkerDao.queryOilConstructionScheduleWorkerByOcsId(oilConstructionSchedulePO.getOcsId());
			if(oilConstructionScheduleWorkerPOs.size() > 0){
				acceptanceVO.setOilWorkerName(userDao.get(oilConstructionScheduleWorkerPOs.get(0).getWorkerId()).getCurrentName());
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
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(acceptanceVO.getOrderId());
		
		if(decorationOrderPO != null){
			decorationOrderPO.setProjectStatus("已完工");
			decorationOrderDao.update(decorationOrderPO);
		}
	}

}