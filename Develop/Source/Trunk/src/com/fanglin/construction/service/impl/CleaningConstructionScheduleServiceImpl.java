/**
 * @File Name		: CleaningConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.CleaningConstructionScheduleDao;
import com.fanglin.construction.dao.CleaningConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.construction.po.CleaningConstructionScheduleWorkerPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.CleaningConstructionScheduleService;
import com.fanglin.construction.vo.CleaningConstructionScheduleVO;
import com.fanglin.construction.vo.CleaningConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("cleaningConstructionScheduleService")
@Transactional(readOnly=true)
public class CleaningConstructionScheduleServiceImpl implements CleaningConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private CleaningConstructionScheduleDao cleaningConstructionScheduleDao;
	
	@Autowired
	private CleaningConstructionScheduleWorkerDao cleaningConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleById(int ccsId){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(ccsId);
		CleaningConstructionScheduleVO cleaningConstructionScheduleVO = new CleaningConstructionScheduleVO();
		
		BeanUtil.copyProperties(cleaningConstructionSchedulePO, cleaningConstructionScheduleVO);
		
		return cleaningConstructionScheduleVO;
	}

	@Override
	public CleaningConstructionScheduleVO queryCleaningConstructionScheduleByOrderId(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.queryCleaningConstructionScheduleByOrderId(cleaningConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(cleaningConstructionSchedulePO, cleaningConstructionScheduleVO);
		
		return cleaningConstructionScheduleVO;
	}
	
	@Override
	public List<CleaningConstructionScheduleWorkerVO> queryCleaningConstructionScheduleWorkerByCcsId(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		List<CleaningConstructionScheduleWorkerPO> cleaningConstructionScheduleWorkerPOs = cleaningConstructionScheduleWorkerDao.queryCleaningConstructionScheduleWorkerByCcsId(cleaningConstructionScheduleVO.getCcsId());
		List<CleaningConstructionScheduleWorkerVO> cleaningConstructionScheduleWorkerVOs = new ArrayList<CleaningConstructionScheduleWorkerVO>();
		
		for(CleaningConstructionScheduleWorkerPO cleaningConstructionScheduleWorkerPO: cleaningConstructionScheduleWorkerPOs){
			CleaningConstructionScheduleWorkerVO cleaningConstructionScheduleWorkerVO = new CleaningConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(cleaningConstructionScheduleWorkerPO, cleaningConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(cleaningConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				cleaningConstructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
				cleaningConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				cleaningConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				cleaningConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			cleaningConstructionScheduleWorkerVOs.add(cleaningConstructionScheduleWorkerVO);
		}
		
		return cleaningConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateCleaningConstructionSchedule(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = null;
		
		if(cleaningConstructionScheduleVO.getCcsId() == 0){
			cleaningConstructionSchedulePO = new CleaningConstructionSchedulePO();
			cleaningConstructionSchedulePO.setEndTime(DateUtil.current(CleaningConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			cleaningConstructionSchedulePO.setStartTime(DateUtil.current(CleaningConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleVO.getCcsId());
		}
		
		BeanUtil.copyProperties(cleaningConstructionScheduleVO, cleaningConstructionSchedulePO);
		cleaningConstructionScheduleDao.saveOrUpdate(cleaningConstructionSchedulePO);
		
		return cleaningConstructionSchedulePO.getCcsId();
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addCleaningConstructionScheduleWorker(CleaningConstructionScheduleWorkerVO cleaningConstructionScheduleWorkerVO) throws FLException{
		
		String workerId = cleaningConstructionScheduleWorkerVO.getWorkerId();
		
		List<CleaningConstructionScheduleWorkerPO> cleaningConstructionScheduleWorkerPOs = cleaningConstructionScheduleWorkerDao.queryCleaningConstructionScheduleWorkerByCcsIdAWorkerId(cleaningConstructionScheduleWorkerVO.getCcsId(), cleaningConstructionScheduleWorkerVO.getWorkerId());
		
		if(cleaningConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		CleaningConstructionScheduleWorkerPO cleaningConstructionScheduleWorkerPO = new CleaningConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(cleaningConstructionScheduleWorkerVO, cleaningConstructionScheduleWorkerPO);
		
		cleaningConstructionScheduleWorkerPO.setWorkerRatyDes("");
		cleaningConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			cleaningConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			cleaningConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
		}
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleWorkerVO.getCcsId());
		if(cleaningConstructionSchedulePO != null && ("".equals(cleaningConstructionSchedulePO.getWorkerId()) || cleaningConstructionSchedulePO.getWorkerId() == null)){
			cleaningConstructionSchedulePO.setWorkerId(workerId);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(cleaningConstructionSchedulePO.getCsId());
			
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & CleaningConstructionSchedulePO.CLEANING_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + CleaningConstructionSchedulePO.CLEANING_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			cleaningConstructionScheduleDao.update(cleaningConstructionSchedulePO);
		}
		
		cleaningConstructionScheduleWorkerDao.saveOrUpdate(cleaningConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(cleaningConstructionScheduleWorkerPO, cleaningConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCleaningConstructionScheduleForTimeFlag(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleVO.getCcsId());
		
		cleaningConstructionSchedulePO.setStartTimeFlag(cleaningConstructionScheduleVO.getStartTimeFlag());
		cleaningConstructionSchedulePO.setEndTimeFlag(cleaningConstructionScheduleVO.getEndTimeFlag());
		
		cleaningConstructionScheduleDao.update(cleaningConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCleaningConstructionScheduleForInfo(CleaningConstructionScheduleVO cleaningConstructionScheduleVO){
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.get(cleaningConstructionScheduleVO.getCcsId());
		
		cleaningConstructionSchedulePO.setWorkerId(cleaningConstructionScheduleVO.getWorkerId());
		cleaningConstructionSchedulePO.setStartTime(cleaningConstructionScheduleVO.getStartTime());
		cleaningConstructionSchedulePO.setEndTime(cleaningConstructionScheduleVO.getEndTime());
		
		cleaningConstructionScheduleDao.update(cleaningConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setCleaningConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int ccswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		CleaningConstructionScheduleWorkerPO cleaningConstructionScheduleWorkerPO = cleaningConstructionScheduleWorkerDao.get(ccswId);
		
		if(cleaningConstructionScheduleWorkerPO != null){
			
			cleaningConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(cleaningConstructionScheduleWorkerPO.getCcswId(), CleaningConstructionSchedulePO.CLEANING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(cleaningConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(cleaningConstructionScheduleWorkerPO.getCcswId());
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(CleaningConstructionSchedulePO.CLEANING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(CleaningConstructionSchedulePO.CLEANING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			cleaningConstructionScheduleWorkerDao.update(cleaningConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setCleaningConstructionScheduleWorkerForRaty(List<CleaningConstructionScheduleWorkerVO> constructionScheduleWorkers){
		
		for(CleaningConstructionScheduleWorkerVO cleaningConstructionScheduleWorkerVO: constructionScheduleWorkers){
			CleaningConstructionScheduleWorkerPO cleaningConstructionScheduleWorkerPO = cleaningConstructionScheduleWorkerDao.get(cleaningConstructionScheduleWorkerVO.getCcswId());
			
			if(cleaningConstructionScheduleWorkerPO != null){
				cleaningConstructionScheduleWorkerPO.setWorkerRaty(cleaningConstructionScheduleWorkerVO.getWorkerRaty());
				cleaningConstructionScheduleWorkerPO.setWorkerRatyDes(cleaningConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				cleaningConstructionScheduleWorkerDao.update(cleaningConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteCleaningConstructionScheduleWorker(CleaningConstructionScheduleWorkerVO cleaningConstructionScheduleWorkerVO) throws FLException {
		
		int ccswId = cleaningConstructionScheduleWorkerVO.getCcswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		CleaningConstructionScheduleWorkerPO cleaningConstructionScheduleWorkerPO = cleaningConstructionScheduleWorkerDao.get(ccswId);
		
		if(cleaningConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(cleaningConstructionScheduleWorkerPO.getCcswId(), CleaningConstructionSchedulePO.CLEANING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}else{
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}
			}
			
			cleaningConstructionScheduleWorkerDao.delete(cleaningConstructionScheduleWorkerPO);
		}
		
		return 0;
	}
	
}
