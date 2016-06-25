/**
 * @File Name		: WaterwayCircuitPowerConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleWorkerDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.construction.service.WaterwayCircuitPowerConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleVO;
import com.fanglin.construction.vo.WaterwayCircuitPowerConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("waterwayCircuitPowerConstructionScheduleService")
@Transactional(readOnly=true)
public class WaterwayCircuitPowerConstructionScheduleServiceImpl implements WaterwayCircuitPowerConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleDao waterwayCircuitPowerConstructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleWorkerDao waterwayCircuitPowerConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleById(int wcpcsId){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(wcpcsId);
		WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO = new WaterwayCircuitPowerConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionSchedulePO, waterwayCircuitPowerConstructionScheduleVO);
		
		return waterwayCircuitPowerConstructionScheduleVO;
	}

	@Override
	public WaterwayCircuitPowerConstructionScheduleVO queryWaterwayCircuitPowerConstructionScheduleByOrderId(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionSchedule){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByOrderId(waterwayCircuitPowerConstructionSchedule.getOrderId());
		WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO = new WaterwayCircuitPowerConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionSchedulePO, waterwayCircuitPowerConstructionScheduleVO);
		
		return waterwayCircuitPowerConstructionScheduleVO;
	}
	
	@Override
	public List<WaterwayCircuitPowerConstructionScheduleWorkerVO> queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsId(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO){
		
		List<WaterwayCircuitPowerConstructionScheduleWorkerPO> waterwayCircuitPowerConstructionScheduleWorkerPOs = waterwayCircuitPowerConstructionScheduleWorkerDao.queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsId(waterwayCircuitPowerConstructionScheduleVO.getWcpcsId());
		List<WaterwayCircuitPowerConstructionScheduleWorkerVO> waterwayCircuitPowerConstructionScheduleWorkerVOs = new ArrayList<WaterwayCircuitPowerConstructionScheduleWorkerVO>();
		
		for(WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO: waterwayCircuitPowerConstructionScheduleWorkerPOs){
			WaterwayCircuitPowerConstructionScheduleWorkerVO waterwayCircuitPowerConstructionScheduleWorkerVO = new WaterwayCircuitPowerConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(waterwayCircuitPowerConstructionScheduleWorkerPO, waterwayCircuitPowerConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(waterwayCircuitPowerConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				waterwayCircuitPowerConstructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
				waterwayCircuitPowerConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				waterwayCircuitPowerConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				waterwayCircuitPowerConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			waterwayCircuitPowerConstructionScheduleWorkerVOs.add(waterwayCircuitPowerConstructionScheduleWorkerVO);
		}
		
		return waterwayCircuitPowerConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateWaterwayCircuitPowerConstructionSchedule(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByOrderId(waterwayCircuitPowerConstructionScheduleVO.getOrderId());
		
		if(waterwayCircuitPowerConstructionScheduleVO.getWcpcsId() == null){
			waterwayCircuitPowerConstructionSchedulePO = new WaterwayCircuitPowerConstructionSchedulePO();
			waterwayCircuitPowerConstructionSchedulePO.setEndTime(DateUtil.current(WaterwayCircuitPowerConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			waterwayCircuitPowerConstructionSchedulePO.setStartTime(DateUtil.current(WaterwayCircuitPowerConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionScheduleVO, waterwayCircuitPowerConstructionSchedulePO);
		waterwayCircuitPowerConstructionScheduleDao.saveOrUpdate(waterwayCircuitPowerConstructionSchedulePO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addWaterwayCircuitPowerConstructionScheduleWorker(WaterwayCircuitPowerConstructionScheduleWorkerVO waterwayCircuitPowerConstructionScheduleWorkerVO) throws FLException{
		
		int workerType = 0;
		String workerId = waterwayCircuitPowerConstructionScheduleWorkerVO.getWorkerId();
		
		List<WaterwayCircuitPowerConstructionScheduleWorkerPO> waterwayCircuitPowerConstructionScheduleWorkerPOs = waterwayCircuitPowerConstructionScheduleWorkerDao.queryWaterwayCircuitPowerConstructionScheduleWorkerByWcpcsIdAWorderId(waterwayCircuitPowerConstructionScheduleWorkerVO.getWcpcsId(), waterwayCircuitPowerConstructionScheduleWorkerVO.getWorkerId());
		
		if(waterwayCircuitPowerConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO = new WaterwayCircuitPowerConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionScheduleWorkerVO, waterwayCircuitPowerConstructionScheduleWorkerPO);
		
		waterwayCircuitPowerConstructionScheduleWorkerPO.setWorkerRatyDes("");
		waterwayCircuitPowerConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			waterwayCircuitPowerConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			waterwayCircuitPowerConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
			
			String duty = userPO.getDuty();
			
			if(duty.contains("水暖工")){
				workerType = 1;
			}else if(duty.contains("力工")){
				workerType = 2;
			}else if(duty.contains("电工")){
				workerType = 3;
			}
		}
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(waterwayCircuitPowerConstructionScheduleWorkerPO.getWcpcsId());
		if(waterwayCircuitPowerConstructionSchedulePO != null){
			if(workerType == 1 && ("".equals(waterwayCircuitPowerConstructionSchedulePO.getWaterwayWorkerId()) || waterwayCircuitPowerConstructionSchedulePO.getWaterwayWorkerId() == null)){
				waterwayCircuitPowerConstructionSchedulePO.setWaterwayWorkerId(workerId);
			}else if(workerType == 2 && ("".equals(waterwayCircuitPowerConstructionSchedulePO.getPowerWorkerId()) || waterwayCircuitPowerConstructionSchedulePO.getPowerWorkerId() == null)){
				waterwayCircuitPowerConstructionSchedulePO.setPowerWorkerId(workerId);
			}else if(workerType == 3 && ("".equals(waterwayCircuitPowerConstructionSchedulePO.getCircuitWorkerId()) || waterwayCircuitPowerConstructionSchedulePO.getCircuitWorkerId() == null)){
				waterwayCircuitPowerConstructionSchedulePO.setCircuitWorkerId(workerId);
			}
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(waterwayCircuitPowerConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & WaterwayCircuitPowerConstructionSchedulePO.WATERWAYCIRCUITPOWER_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + WaterwayCircuitPowerConstructionSchedulePO.WATERWAYCIRCUITPOWER_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			waterwayCircuitPowerConstructionScheduleDao.update(waterwayCircuitPowerConstructionSchedulePO);
		}
		
		waterwayCircuitPowerConstructionScheduleWorkerDao.save(waterwayCircuitPowerConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(waterwayCircuitPowerConstructionScheduleWorkerPO, waterwayCircuitPowerConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitPowerConstructionScheduleForTimeFlag(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(waterwayCircuitPowerConstructionScheduleVO.getWcpcsId());
		
		waterwayCircuitPowerConstructionSchedulePO.setStartTimeFlag(waterwayCircuitPowerConstructionScheduleVO.getStartTimeFlag());
		waterwayCircuitPowerConstructionSchedulePO.setEndTimeFlag(waterwayCircuitPowerConstructionScheduleVO.getEndTimeFlag());
		
		waterwayCircuitPowerConstructionScheduleDao.update(waterwayCircuitPowerConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitPowerConstructionScheduleForInfo(WaterwayCircuitPowerConstructionScheduleVO waterwayCircuitPowerConstructionScheduleVO){
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.get(waterwayCircuitPowerConstructionScheduleVO.getWcpcsId());
		
		if(waterwayCircuitPowerConstructionSchedulePO != null){
			waterwayCircuitPowerConstructionSchedulePO.setEndTime(waterwayCircuitPowerConstructionScheduleVO.getEndTime());
			waterwayCircuitPowerConstructionSchedulePO.setStartTime(waterwayCircuitPowerConstructionScheduleVO.getStartTime());
			
			waterwayCircuitPowerConstructionScheduleDao.update(waterwayCircuitPowerConstructionSchedulePO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setWaterwayCircuitPowerConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int wcpcswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO = waterwayCircuitPowerConstructionScheduleWorkerDao.get(wcpcswId);
		
		if(waterwayCircuitPowerConstructionScheduleWorkerPO != null){
			
			waterwayCircuitPowerConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			int workerTypeId = 0;
			String workerType = "";
			UserPO userPO = userDao.get(constructionScheduleWorkerVO.getWorkerId());
			if(userPO != null){
				if(userPO.getDuty().contains("水暖")){
					workerTypeId = WaterwayCircuitPowerConstructionScheduleWorkerPO.WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT;
					workerType = WaterwayCircuitPowerConstructionScheduleWorkerPO.WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR;
				}else if(userPO.getDuty().contains("力工")){
					workerTypeId = WaterwayCircuitPowerConstructionScheduleWorkerPO.POWER_CONSTRUCTION_SCHEDULE_TYPE_ID_INT;
					workerType = WaterwayCircuitPowerConstructionScheduleWorkerPO.POWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR;
				}else if(userPO.getDuty().contains("电工")){
					workerTypeId = WaterwayCircuitPowerConstructionScheduleWorkerPO.CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT;
					workerType = WaterwayCircuitPowerConstructionScheduleWorkerPO.CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR;
				}
			}
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(waterwayCircuitPowerConstructionScheduleWorkerPO.getWcpcswId(), workerTypeId);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(waterwayCircuitPowerConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(waterwayCircuitPowerConstructionScheduleWorkerPO.getWcpcswId());
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				
				workerBaseSalaryPO.setWorkTypeId(workerTypeId);
				workerBaseSalaryPO.setWorkType(workerType);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			waterwayCircuitPowerConstructionScheduleWorkerDao.update(waterwayCircuitPowerConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitPowerConstructionScheduleWorkerForRaty(List<WaterwayCircuitPowerConstructionScheduleWorkerVO> constructionScheduleWorkers){
		
		for(WaterwayCircuitPowerConstructionScheduleWorkerVO waterwayCircuitPowerConstructionScheduleWorkerVO: constructionScheduleWorkers){
			WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO = waterwayCircuitPowerConstructionScheduleWorkerDao.get(waterwayCircuitPowerConstructionScheduleWorkerVO.getWcpcswId());
			
			if(waterwayCircuitPowerConstructionScheduleWorkerPO != null){
				waterwayCircuitPowerConstructionScheduleWorkerPO.setWorkerRaty(waterwayCircuitPowerConstructionScheduleWorkerVO.getWorkerRaty());
				waterwayCircuitPowerConstructionScheduleWorkerPO.setWorkerRatyDes(waterwayCircuitPowerConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				waterwayCircuitPowerConstructionScheduleWorkerDao.update(waterwayCircuitPowerConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteWaterwayCircuitPowerConstructionScheduleWorker(WaterwayCircuitPowerConstructionScheduleWorkerVO waterwayCircuitPowerConstructionScheduleWorkerVO) throws FLException {
		
		int wcpcswId = waterwayCircuitPowerConstructionScheduleWorkerVO.getWcpcswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		WaterwayCircuitPowerConstructionScheduleWorkerPO waterwayCircuitPowerConstructionScheduleWorkerPO = waterwayCircuitPowerConstructionScheduleWorkerDao.get(wcpcswId);
		
		if(waterwayCircuitPowerConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(wcpcswId, BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}
				
				workerBaseSalaryDao.delete(workerBaseSalaryPO);
			}
			
			waterwayCircuitPowerConstructionScheduleWorkerDao.delete(waterwayCircuitPowerConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

}
