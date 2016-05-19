/**
 * @File Name		: ConstructionScheduleWorkerServiceImpl.java
 * @Package   	: com.fanglin.construction.service.impl
 * @Version		: 1.0
 * @Date			: 2015-8-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.BricklayConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.CarpentConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.ChanConstructionScheduleDao;
import com.fanglin.construction.dao.CleaningConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.GroundLevelingConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.OilConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.PutlineConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleWorkerDao;
import com.fanglin.construction.po.BricklayConstructionScheduleWorkerPO;
import com.fanglin.construction.po.CarpentConstructionScheduleWorkerPO;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.CleaningConstructionScheduleWorkerPO;
import com.fanglin.construction.po.GroundLevelingConstructionScheduleWorkerPO;
import com.fanglin.construction.po.OilConstructionScheduleWorkerPO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionScheduleWorkerPO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.construction.service.ConstructionScheduleWorkerService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;

@Service("constructionScheduleWorkerService")
@Transactional(readOnly=true)
public class ConstructionScheduleWorkerServiceImpl implements ConstructionScheduleWorkerService {
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ChanConstructionScheduleDao chanConstructionScheduleDao;
	
	@Autowired
	private PutlineConstructionScheduleDao putlineConstructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleWorkerDao waterwayCircuitPowerConstructionScheduleWorkerDao;
	
	@Autowired
	private BricklayConstructionScheduleWorkerDao bricklayConstructionScheduleWorkerDao;
	
	@Autowired
	private GroundLevelingConstructionScheduleWorkerDao groundLevelingConstructionScheduleWorkerDao;
	
	@Autowired
	private CarpentConstructionScheduleWorkerDao carpentConstructionScheduleWorkerDao;
	
	@Autowired
	private OilConstructionScheduleWorkerDao oilConstructionScheduleWorkerDao;
	
	@Autowired
	private WaterwayCircuitCheckConstructionScheduleWorkerDao waterwayCircuitCheckConstructionScheduleWorkerDao;
	
	@Autowired
	private CleaningConstructionScheduleWorkerDao cleaningConstructionScheduleWorkerDao;

	@Override
	public Map<String, List<ConstructionScheduleWorkerVO>> queryConstructionScheduleWorkerByOrderId(ConstructionScheduleVO constructionScheduleVO) {
		
		String orderId = constructionScheduleVO.getOrderId();
		
		Map<String, List<ConstructionScheduleWorkerVO>> constructionScheduleWorkers = new HashMap<String, List<ConstructionScheduleWorkerVO>>();
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(orderId);
		
		if(chanConstructionSchedulePO != null){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = chanConstructionSchedulePO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					List<ConstructionScheduleWorkerVO> constructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
					constructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
					
					constructionScheduleWorkers.put("铲大白", constructionScheduleWorkerVOs);
				}
			}
		}
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		
		if(putlineConstructionSchedulePO != null){
			
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = putlineConstructionSchedulePO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					List<ConstructionScheduleWorkerVO> constructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
					constructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
					
					constructionScheduleWorkers.put("放线", constructionScheduleWorkerVOs);
				}
			}
		}
		
		List<WaterwayCircuitPowerConstructionScheduleWorkerPO> waterwayCircuitPowerConstructionScheduleWorkerPOs = waterwayCircuitPowerConstructionScheduleWorkerDao.queryWaterwayCircuitPowerConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> waterwayCircuitPowerConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO: waterwayCircuitPowerConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = waterwayCircuitPowerConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					waterwayCircuitPowerConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(waterwayCircuitPowerConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("水力电", waterwayCircuitPowerConstructionScheduleWorkerVOs);
		}
		
		List<BricklayConstructionScheduleWorkerPO> bricklayConstructionScheduleWorkerPOs = bricklayConstructionScheduleWorkerDao.queryBricklayConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> bricklayConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(BricklayConstructionScheduleWorkerPO bricklayConstructionScheduleWorkerPO: bricklayConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = bricklayConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					bricklayConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(bricklayConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("瓦工", bricklayConstructionScheduleWorkerVOs);
		}
		
		List<GroundLevelingConstructionScheduleWorkerPO> groundLevelingConstructionScheduleWorkerPOs = groundLevelingConstructionScheduleWorkerDao.queryGroundLevelingConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> groundLevelingConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(GroundLevelingConstructionScheduleWorkerPO groundLevelingConstructionScheduleWorkerPO: groundLevelingConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = groundLevelingConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					groundLevelingConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(groundLevelingConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("地面找平", groundLevelingConstructionScheduleWorkerVOs);
		}
		
		List<CarpentConstructionScheduleWorkerPO> carpentConstructionScheduleWorkerPOs = carpentConstructionScheduleWorkerDao.queryCarpentConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> carpentConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(CarpentConstructionScheduleWorkerPO carpentConstructionScheduleWorkerPO: carpentConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = carpentConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					carpentConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(carpentConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("木工", carpentConstructionScheduleWorkerVOs);
		}
		
		List<OilConstructionScheduleWorkerPO> oilConstructionScheduleWorkerPOs = oilConstructionScheduleWorkerDao.queryOilConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> oilConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(OilConstructionScheduleWorkerPO oilConstructionScheduleWorkerPO: oilConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = oilConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					oilConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(oilConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("油工", oilConstructionScheduleWorkerVOs);
		}
		
		List<WaterwayCircuitCheckConstructionScheduleWorkerPO> waterwayCircuitCheckConstructionScheduleWorkerPOs = waterwayCircuitCheckConstructionScheduleWorkerDao.queryWaterwayCircuitCheckConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> waterwayCircuitCheckConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(WaterwayCircuitCheckConstructionScheduleWorkerPO waterwayCircuitCheckConstructionScheduleWorkerPO: waterwayCircuitCheckConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = waterwayCircuitCheckConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					waterwayCircuitCheckConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(waterwayCircuitCheckConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("水电验收", waterwayCircuitCheckConstructionScheduleWorkerVOs);
		}
		
		List<CleaningConstructionScheduleWorkerPO> cleaningConstructionScheduleWorkerPOs = cleaningConstructionScheduleWorkerDao.queryCleaningConstructionScheduleWorkerByOrderId(orderId);
		List<ConstructionScheduleWorkerVO> cleaningConstructionScheduleWorkerVOs = new ArrayList<ConstructionScheduleWorkerVO>();
		
		for(CleaningConstructionScheduleWorkerPO cleaningConstructionScheduleWorkerPO: cleaningConstructionScheduleWorkerPOs){
			ConstructionScheduleWorkerVO constructionScheduleWorkerVO = new ConstructionScheduleWorkerVO();
			
			String workerId = cleaningConstructionScheduleWorkerPO.getWorkerId();
			
			if(workerId != null && !"".equals(workerId)){
				UserPO userPO = userDao.get(workerId);
				
				if(userPO != null){
					constructionScheduleWorkerVO.setWorkerName(userPO.getCurrentName());
					constructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
					constructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
					
					cleaningConstructionScheduleWorkerVOs.add(constructionScheduleWorkerVO);
				}
			}
		}
		
		if(cleaningConstructionScheduleWorkerVOs.size() > 0){
			constructionScheduleWorkers.put("保洁", cleaningConstructionScheduleWorkerVOs);
		}
		
		return constructionScheduleWorkers;
	}

}
