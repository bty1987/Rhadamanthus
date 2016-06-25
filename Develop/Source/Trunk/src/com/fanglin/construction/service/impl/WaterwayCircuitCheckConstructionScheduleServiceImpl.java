/**
 * @File Name		: WaterwayCircuitCheckConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.constructionSchedule.impl
 * @Version		: 1.0
 * @Date			: 2015-4-9
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
import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleWorkerDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionScheduleWorkerPO;
import com.fanglin.construction.service.WaterwayCircuitCheckConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleVO;
import com.fanglin.construction.vo.WaterwayCircuitCheckConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("waterwayCircuitCheckConstructionScheduleService")
@Transactional(readOnly=true)
public class WaterwayCircuitCheckConstructionScheduleServiceImpl implements WaterwayCircuitCheckConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitCheckConstructionScheduleDao waterwayCircuitCheckConstructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitCheckConstructionScheduleWorkerDao waterwayCircuitCheckConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleById(int wcccsId){
		
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(wcccsId);
		WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO = new WaterwayCircuitCheckConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionSchedulePO, waterwayCircuitCheckConstructionScheduleVO);
		
		return waterwayCircuitCheckConstructionScheduleVO;
	}

	@Override
	public WaterwayCircuitCheckConstructionScheduleVO queryWaterwayCircuitCheckConstructionScheduleByOrderId(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionSchedule){
		
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByOrderId(waterwayCircuitCheckConstructionSchedule.getOrderId());
		WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO = new WaterwayCircuitCheckConstructionScheduleVO();
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionSchedulePO, waterwayCircuitCheckConstructionScheduleVO);
		
		return waterwayCircuitCheckConstructionScheduleVO;
	}

	@Override
	public List<WaterwayCircuitCheckConstructionScheduleWorkerVO> queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsId(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		
		List<WaterwayCircuitCheckConstructionScheduleWorkerPO> waterwayCircuitCheckConstructionScheduleWorkerPOs = waterwayCircuitCheckConstructionScheduleWorkerDao.queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsId(waterwayCircuitCheckConstructionScheduleVO.getWcccsId());
		List<WaterwayCircuitCheckConstructionScheduleWorkerVO> waterwayCircuitCheckConstructionScheduleWorkerVOs = new ArrayList<WaterwayCircuitCheckConstructionScheduleWorkerVO>();
		
		for(WaterwayCircuitCheckConstructionScheduleWorkerPO waterwayCircuitCheckConstructionScheduleWorkerPO: waterwayCircuitCheckConstructionScheduleWorkerPOs){
			WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorkerVO = new WaterwayCircuitCheckConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(waterwayCircuitCheckConstructionScheduleWorkerPO, waterwayCircuitCheckConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(waterwayCircuitCheckConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				waterwayCircuitCheckConstructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
				waterwayCircuitCheckConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				waterwayCircuitCheckConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				waterwayCircuitCheckConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			waterwayCircuitCheckConstructionScheduleWorkerVOs.add(waterwayCircuitCheckConstructionScheduleWorkerVO);
		}
		
		return waterwayCircuitCheckConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateWaterwayCircuitCheckConstructionSchedule(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByOrderId(waterwayCircuitCheckConstructionScheduleVO.getOrderId());
		
		if(waterwayCircuitCheckConstructionScheduleVO.getWcccsId() == null){
			waterwayCircuitCheckConstructionSchedulePO = new WaterwayCircuitCheckConstructionSchedulePO();
			waterwayCircuitCheckConstructionSchedulePO.setEndTime(DateUtil.current(WaterwayCircuitCheckConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			waterwayCircuitCheckConstructionSchedulePO.setStartTime(DateUtil.current(WaterwayCircuitCheckConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionScheduleVO, waterwayCircuitCheckConstructionSchedulePO);
		waterwayCircuitCheckConstructionScheduleDao.saveOrUpdate(waterwayCircuitCheckConstructionSchedulePO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addWaterwayCircuitCheckConstructionScheduleWorker(WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorkerVO) throws FLException{

		int workerType = 0;
		String workerId = waterwayCircuitCheckConstructionScheduleWorkerVO.getWorkerId();
		
		List<WaterwayCircuitCheckConstructionScheduleWorkerPO> waterwayCircuitCheckConstructionScheduleWorkerPOs = waterwayCircuitCheckConstructionScheduleWorkerDao.queryWaterwayCircuitCheckConstructionScheduleWorkerByWcccsIdAWorderId(waterwayCircuitCheckConstructionScheduleWorkerVO.getWcccsId(), waterwayCircuitCheckConstructionScheduleWorkerVO.getWorkerId());
		
		if(waterwayCircuitCheckConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		WaterwayCircuitCheckConstructionScheduleWorkerPO waterwayCircuitCheckConstructionScheduleWorkerPO = new WaterwayCircuitCheckConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionScheduleWorkerVO, waterwayCircuitCheckConstructionScheduleWorkerPO);
		
		waterwayCircuitCheckConstructionScheduleWorkerPO.setWorkerRatyDes("");
		waterwayCircuitCheckConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			waterwayCircuitCheckConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			waterwayCircuitCheckConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
			
			String duty = userPO.getDuty();
			
			if(duty.contains("水暖工")){
				workerType = 1;
			}else if(duty.contains("力工")){
				workerType = 2;
			}else if(duty.contains("电工")){
				workerType = 3;
			}
		}
		
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(waterwayCircuitCheckConstructionScheduleWorkerPO.getWcccsId());
		if(waterwayCircuitCheckConstructionSchedulePO != null){
			if(workerType == 1 && ("".equals(waterwayCircuitCheckConstructionSchedulePO.getWaterwayWorkerId()) || waterwayCircuitCheckConstructionSchedulePO.getWaterwayWorkerId() == null)){
				waterwayCircuitCheckConstructionSchedulePO.setWaterwayWorkerId(workerId);
			}else if(workerType == 2 && ("".equals(waterwayCircuitCheckConstructionSchedulePO.getPowerWorkerId()) || waterwayCircuitCheckConstructionSchedulePO.getPowerWorkerId() == null)){
				waterwayCircuitCheckConstructionSchedulePO.setPowerWorkerId(workerId);
			}else if(workerType == 3 && ("".equals(waterwayCircuitCheckConstructionSchedulePO.getCircuitWorkerId()) || waterwayCircuitCheckConstructionSchedulePO.getCircuitWorkerId() == null)){
				waterwayCircuitCheckConstructionSchedulePO.setCircuitWorkerId(workerId);
			}
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(waterwayCircuitCheckConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & WaterwayCircuitCheckConstructionSchedulePO.WATERWAYCIRCUITCHECK_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + WaterwayCircuitCheckConstructionSchedulePO.WATERWAYCIRCUITCHECK_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			waterwayCircuitCheckConstructionScheduleDao.update(waterwayCircuitCheckConstructionSchedulePO);
		}
		
		waterwayCircuitCheckConstructionScheduleWorkerDao.saveOrUpdate(waterwayCircuitCheckConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(waterwayCircuitCheckConstructionScheduleWorkerPO, waterwayCircuitCheckConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitCheckConstructionScheduleForTimeFlag(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(waterwayCircuitCheckConstructionScheduleVO.getWcccsId());
		
		waterwayCircuitCheckConstructionSchedulePO.setStartTimeFlag(waterwayCircuitCheckConstructionScheduleVO.getStartTimeFlag());
		waterwayCircuitCheckConstructionSchedulePO.setEndTimeFlag(waterwayCircuitCheckConstructionScheduleVO.getEndTimeFlag());
		
		waterwayCircuitCheckConstructionScheduleDao.update(waterwayCircuitCheckConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitCheckConstructionScheduleForInfo(WaterwayCircuitCheckConstructionScheduleVO waterwayCircuitCheckConstructionScheduleVO){
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.get(waterwayCircuitCheckConstructionScheduleVO.getWcccsId());
		
		if(waterwayCircuitCheckConstructionSchedulePO != null){
			waterwayCircuitCheckConstructionSchedulePO.setEndTime(waterwayCircuitCheckConstructionScheduleVO.getEndTime());
			waterwayCircuitCheckConstructionSchedulePO.setStartTime(waterwayCircuitCheckConstructionScheduleVO.getStartTime());
			
			waterwayCircuitCheckConstructionScheduleDao.update(waterwayCircuitCheckConstructionSchedulePO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setWaterwayCircuitCheckConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{

		int wcccswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		WaterwayCircuitCheckConstructionScheduleWorkerPO waterwayCircuitCheckConstructionScheduleWorkerPO = waterwayCircuitCheckConstructionScheduleWorkerDao.get(wcccswId);
		
		if(waterwayCircuitCheckConstructionScheduleWorkerPO != null){
			
			waterwayCircuitCheckConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			int workerTypeId = 0;
			String workerType = "";
			UserPO userPO = userDao.get(constructionScheduleWorkerVO.getWorkerId());
			if(userPO != null){
				if(userPO.getDuty().contains("水暖")){
					workerTypeId = WaterwayCircuitCheckConstructionScheduleWorkerPO.WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT;
					workerType = WaterwayCircuitCheckConstructionScheduleWorkerPO.WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR;
				}else if(userPO.getDuty().contains("力工")){
					workerTypeId = WaterwayCircuitCheckConstructionScheduleWorkerPO.POWER_CONSTRUCTION_SCHEDULE_TYPE_ID_INT;
					workerType = WaterwayCircuitCheckConstructionScheduleWorkerPO.POWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR;
				}else if(userPO.getDuty().contains("电工")){
					workerTypeId = WaterwayCircuitCheckConstructionScheduleWorkerPO.CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT;
					workerType = WaterwayCircuitCheckConstructionScheduleWorkerPO.CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR;
				}
			}
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(waterwayCircuitCheckConstructionScheduleWorkerPO.getWcccswId(), workerTypeId);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(waterwayCircuitCheckConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(waterwayCircuitCheckConstructionScheduleWorkerPO.getWcccswId());
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
			
			waterwayCircuitCheckConstructionScheduleWorkerDao.update(waterwayCircuitCheckConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setWaterwayCircuitCheckConstructionScheduleWorkerForRaty(List<WaterwayCircuitCheckConstructionScheduleWorkerVO> constructionScheduleWorkers){

		for(WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorkerVO: constructionScheduleWorkers){
			WaterwayCircuitCheckConstructionScheduleWorkerPO waterwayCircuitCheckConstructionScheduleWorkerPO = waterwayCircuitCheckConstructionScheduleWorkerDao.get(waterwayCircuitCheckConstructionScheduleWorkerVO.getWcccswId());
			
			if(waterwayCircuitCheckConstructionScheduleWorkerPO != null){
				waterwayCircuitCheckConstructionScheduleWorkerPO.setWorkerRaty(waterwayCircuitCheckConstructionScheduleWorkerVO.getWorkerRaty());
				waterwayCircuitCheckConstructionScheduleWorkerPO.setWorkerRatyDes(waterwayCircuitCheckConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				waterwayCircuitCheckConstructionScheduleWorkerDao.update(waterwayCircuitCheckConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteWaterwayCircuitCheckConstructionScheduleWorker(WaterwayCircuitCheckConstructionScheduleWorkerVO waterwayCircuitCheckConstructionScheduleWorkerVO) throws FLException {
		
		int wcccswId = waterwayCircuitCheckConstructionScheduleWorkerVO.getWcccswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		WaterwayCircuitCheckConstructionScheduleWorkerPO waterwayCircuitCheckConstructionScheduleWorkerPO = waterwayCircuitCheckConstructionScheduleWorkerDao.get(wcccswId);
		
		if(waterwayCircuitCheckConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(wcccswId, BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}else{
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}
			}
			
			waterwayCircuitCheckConstructionScheduleWorkerDao.delete(waterwayCircuitCheckConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

}
