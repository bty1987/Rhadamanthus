/**
 * @File Name		: CarpentConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.CarpentConstructionScheduleDao;
import com.fanglin.construction.dao.CarpentConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.po.CarpentConstructionScheduleWorkerPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.CarpentConstructionScheduleService;
import com.fanglin.construction.vo.CarpentConstructionScheduleVO;
import com.fanglin.construction.vo.CarpentConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("carpentConstructionScheduleService")
@Transactional(readOnly=true)
public class CarpentConstructionScheduleServiceImpl implements CarpentConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private CarpentConstructionScheduleDao carpentConstructionScheduleDao;
	
	@Autowired
	private CarpentConstructionScheduleWorkerDao carpentConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleById(int ccsId){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(ccsId);
		CarpentConstructionScheduleVO carpentConstructionScheduleVO = new CarpentConstructionScheduleVO();
		BeanUtil.copyProperties(carpentConstructionSchedulePO, carpentConstructionScheduleVO);
		
		return carpentConstructionScheduleVO;
	}

	@Override
	public CarpentConstructionScheduleVO queryCarpentConstructionScheduleByOrderId(CarpentConstructionScheduleVO carpentConstructionScheduleVO){

		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByOrderId(carpentConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(carpentConstructionSchedulePO, carpentConstructionScheduleVO);
		
		return carpentConstructionScheduleVO;
	}
	
	@Override
	public List<CarpentConstructionScheduleWorkerVO> queryCarpentConstructionScheduleWorkerByCcsId(CarpentConstructionScheduleVO carpentConstructionScheduleVO){
		
		List<CarpentConstructionScheduleWorkerPO> carpentConstructionScheduleWorkerPOs = carpentConstructionScheduleWorkerDao.queryCarpentConstructionScheduleWorkerByCcsId(carpentConstructionScheduleVO.getCcsId());
		List<CarpentConstructionScheduleWorkerVO> carpentConstructionScheduleWorkerVOs = new ArrayList<CarpentConstructionScheduleWorkerVO>();
		
		for(CarpentConstructionScheduleWorkerPO carpentConstructionScheduleWorkerPO: carpentConstructionScheduleWorkerPOs){
			CarpentConstructionScheduleWorkerVO carpentConstructionScheduleWorkerVO = new CarpentConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(carpentConstructionScheduleWorkerPO, carpentConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(carpentConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				carpentConstructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
				carpentConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				carpentConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				carpentConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			carpentConstructionScheduleWorkerVOs.add(carpentConstructionScheduleWorkerVO);
		}
		
		return carpentConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateCarpentConstructionSchedule(CarpentConstructionScheduleVO carpentConstructionScheduleVO){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = null;
		
		if(carpentConstructionScheduleVO.getCcsId() == 0){
			carpentConstructionSchedulePO = new CarpentConstructionSchedulePO();
			carpentConstructionSchedulePO.setStartTime(DateUtil.current(CarpentConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			carpentConstructionSchedulePO.setEndTime(DateUtil.current(CarpentConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByOrderId(carpentConstructionScheduleVO.getOrderId());
		}
		
		BeanUtil.copyProperties(carpentConstructionScheduleVO, carpentConstructionSchedulePO);
		carpentConstructionScheduleDao.saveOrUpdate(carpentConstructionSchedulePO);
		
		return carpentConstructionSchedulePO.getCcsId();
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCarpentConstructionScheduleForTimeFlag(CarpentConstructionScheduleVO carpentConstructionScheduleVO){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(carpentConstructionScheduleVO.getCcsId());
		
		carpentConstructionSchedulePO.setStartTimeFlag(carpentConstructionScheduleVO.getStartTimeFlag());
		carpentConstructionSchedulePO.setEndTimeFlag(carpentConstructionScheduleVO.getStartTimeFlag());
		
		carpentConstructionScheduleDao.update(carpentConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCarpentConstructionScheduleForInfo(CarpentConstructionScheduleVO carpentConstructionScheduleVO){
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(carpentConstructionScheduleVO.getCcsId());
		
		carpentConstructionSchedulePO.setWorkerId(carpentConstructionScheduleVO.getWorkerId());
		carpentConstructionSchedulePO.setStartTime(carpentConstructionScheduleVO.getStartTime());
		carpentConstructionSchedulePO.setEndTime(carpentConstructionScheduleVO.getEndTime());
		
		carpentConstructionScheduleDao.update(carpentConstructionSchedulePO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addCarpentConstructionScheduleWorker(CarpentConstructionScheduleWorkerVO carpentConstructionScheduleWorkerVO) throws FLException{
		
		String workerId = carpentConstructionScheduleWorkerVO.getWorkerId();
		
		List<CarpentConstructionScheduleWorkerPO> carpentConstructionScheduleWorkerPOs = carpentConstructionScheduleWorkerDao.queryCarpentConstructionScheduleWorkerByCssIdAWorkerId(carpentConstructionScheduleWorkerVO.getCcsId(), carpentConstructionScheduleWorkerVO.getWorkerId());
		
		if(carpentConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		CarpentConstructionScheduleWorkerPO carpentConstructionScheduleWorkerPO = new CarpentConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(carpentConstructionScheduleWorkerVO, carpentConstructionScheduleWorkerPO);
		
		carpentConstructionScheduleWorkerPO.setWorkerRatyDes("");
		carpentConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			carpentConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			carpentConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
		}
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.get(carpentConstructionScheduleWorkerVO.getCcsId());
		if(carpentConstructionSchedulePO != null && ("".equals(carpentConstructionSchedulePO.getWorkerId()) || carpentConstructionSchedulePO.getWorkerId() == null)){
			carpentConstructionSchedulePO.setWorkerId(workerId);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(carpentConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & CarpentConstructionSchedulePO.CARPENT_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + CarpentConstructionSchedulePO.CARPENT_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			carpentConstructionScheduleDao.update(carpentConstructionSchedulePO);
		}
		
		carpentConstructionScheduleWorkerDao.saveOrUpdate(carpentConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(carpentConstructionScheduleWorkerPO, carpentConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setCarpentConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int ccswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		CarpentConstructionScheduleWorkerPO carpentConstructionScheduleWorkerPO = carpentConstructionScheduleWorkerDao.get(ccswId);
		
		if(carpentConstructionScheduleWorkerPO != null){
			
			carpentConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(carpentConstructionScheduleWorkerPO.getCcswId(), CarpentConstructionSchedulePO.CARPENT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(carpentConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(carpentConstructionScheduleWorkerPO.getCcswId());
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(CarpentConstructionSchedulePO.CARPENT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(CarpentConstructionSchedulePO.CARPENT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			carpentConstructionScheduleWorkerDao.update(carpentConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCarpentConstructionScheduleWorkerForRaty(List<CarpentConstructionScheduleWorkerVO> constructionScheduleWorkers){
		
		for(CarpentConstructionScheduleWorkerVO carpentConstructionScheduleWorkerVO: constructionScheduleWorkers){
			CarpentConstructionScheduleWorkerPO carpentConstructionScheduleWorkerPO = carpentConstructionScheduleWorkerDao.get(carpentConstructionScheduleWorkerVO.getCcswId());
			if(carpentConstructionScheduleWorkerPO != null){
				carpentConstructionScheduleWorkerPO.setWorkerRaty(carpentConstructionScheduleWorkerVO.getWorkerRaty());
				carpentConstructionScheduleWorkerPO.setWorkerRatyDes(carpentConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				carpentConstructionScheduleWorkerDao.update(carpentConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteCarpentConstructionScheduleWorker(CarpentConstructionScheduleWorkerVO carpentConstructionScheduleWorkerVO) throws FLException {
		
		int ccswId = carpentConstructionScheduleWorkerVO.getCcswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		CarpentConstructionScheduleWorkerPO carpentConstructionScheduleWorkerPO = carpentConstructionScheduleWorkerDao.get(ccswId);
		
		if(carpentConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(carpentConstructionScheduleWorkerPO.getCcswId(), CarpentConstructionSchedulePO.CARPENT_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}else{
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}
			}
			
			carpentConstructionScheduleWorkerDao.delete(carpentConstructionScheduleWorkerPO);
		}
		
		return 0;
	}
	
}
