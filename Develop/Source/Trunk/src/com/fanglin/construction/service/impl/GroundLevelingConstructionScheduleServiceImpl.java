/**
 * @File Name		: GroundLevelingConstructionScheduleServiceImpl.java
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
import com.fanglin.construction.dao.GroundLevelingConstructionScheduleDao;
import com.fanglin.construction.dao.GroundLevelingConstructionScheduleWorkerDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.po.GroundLevelingConstructionScheduleWorkerPO;
import com.fanglin.construction.service.GroundLevelingConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.GroundLevelingConstructionScheduleVO;
import com.fanglin.construction.vo.GroundLevelingConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("groundLevelingConstructionScheduleService")
@Transactional(readOnly=true)
public class GroundLevelingConstructionScheduleServiceImpl implements GroundLevelingConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private GroundLevelingConstructionScheduleDao groundLevelingConstructionScheduleDao;
	
	@Autowired
	private GroundLevelingConstructionScheduleWorkerDao groundLevelingConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleById(int glcsId){
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(glcsId);
		GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO = new GroundLevelingConstructionScheduleVO();
		
		BeanUtil.copyProperties(groundLevelingConstructionSchedulePO, groundLevelingConstructionScheduleVO);
		
		return groundLevelingConstructionScheduleVO;
	}

	@Override
	public GroundLevelingConstructionScheduleVO queryGroundLevelingConstructionScheduleByOrderId(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.queryGroundLevelingConstructionScheduleByOrderId(groundLevelingConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(groundLevelingConstructionSchedulePO, groundLevelingConstructionScheduleVO);
		
		return groundLevelingConstructionScheduleVO;
	}

	@Override
	public List<GroundLevelingConstructionScheduleWorkerVO> queryGroundLevelingConstructionScheduleWorkerByOcsId(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		
		List<GroundLevelingConstructionScheduleWorkerPO> groundLevelingConstructionScheduleWorkerPOs = groundLevelingConstructionScheduleWorkerDao.queryGroundLevelingConstructionScheduleWorkerByGlcsId(groundLevelingConstructionScheduleVO.getGlcsId());
		List<GroundLevelingConstructionScheduleWorkerVO> groundLevelingConstructionScheduleWorkerVOs = new ArrayList<GroundLevelingConstructionScheduleWorkerVO>();
		
		for(GroundLevelingConstructionScheduleWorkerPO groundLevelingConstructionScheduleWorkerPO: groundLevelingConstructionScheduleWorkerPOs){
			GroundLevelingConstructionScheduleWorkerVO groundLevelingConstructionScheduleWorkerVO = new GroundLevelingConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(groundLevelingConstructionScheduleWorkerPO, groundLevelingConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(groundLevelingConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				groundLevelingConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				groundLevelingConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				groundLevelingConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			groundLevelingConstructionScheduleWorkerVOs.add(groundLevelingConstructionScheduleWorkerVO);
		}
		
		return groundLevelingConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateGroundLevelingConstructionSchedule(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){

		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = null;
		
		if(groundLevelingConstructionScheduleVO.getGlcsId() == 0){
			groundLevelingConstructionSchedulePO = new GroundLevelingConstructionSchedulePO();
			groundLevelingConstructionSchedulePO.setEndTime(DateUtil.current(GroundLevelingConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			groundLevelingConstructionSchedulePO.setStartTime(DateUtil.current(GroundLevelingConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleVO.getGlcsId());
		}
		
		BeanUtil.copyProperties(groundLevelingConstructionScheduleVO, groundLevelingConstructionSchedulePO);
		groundLevelingConstructionScheduleDao.saveOrUpdate(groundLevelingConstructionSchedulePO);

		return groundLevelingConstructionSchedulePO.getGlcsId();
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addGroundLevelingConstructionScheduleWorker(GroundLevelingConstructionScheduleWorkerVO groundLevelingConstructionScheduleWorkerVO) throws FLException{
		
		String workerId = groundLevelingConstructionScheduleWorkerVO.getWorkerId();
		
		List<GroundLevelingConstructionScheduleWorkerPO> groundLevelingConstructionScheduleWorkerPOs = groundLevelingConstructionScheduleWorkerDao.queryGroundLevelingConstructionScheduleWorkerByGlcsIdAWorkerId(groundLevelingConstructionScheduleWorkerVO.getGlcsId(), groundLevelingConstructionScheduleWorkerVO.getWorkerId());
		
		if(groundLevelingConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		GroundLevelingConstructionScheduleWorkerPO groundLevelingConstructionScheduleWorkerPO = new GroundLevelingConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(groundLevelingConstructionScheduleWorkerVO, groundLevelingConstructionScheduleWorkerPO);
		
		groundLevelingConstructionScheduleWorkerPO.setWorkerRatyDes("");
		groundLevelingConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			groundLevelingConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			groundLevelingConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
		}
		
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleWorkerVO.getGlcsId());
		if(groundLevelingConstructionSchedulePO != null && ("".equals(groundLevelingConstructionSchedulePO.getWorkerId()) || groundLevelingConstructionSchedulePO.getWorkerId() == null)){
			groundLevelingConstructionSchedulePO.setWorkerId(workerId);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(groundLevelingConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & GroundLevelingConstructionSchedulePO.GROUNDLEVELING_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + GroundLevelingConstructionSchedulePO.GROUNDLEVELING_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			groundLevelingConstructionScheduleDao.update(groundLevelingConstructionSchedulePO);
		}
		
		groundLevelingConstructionScheduleWorkerDao.saveOrUpdate(groundLevelingConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(groundLevelingConstructionScheduleWorkerPO, groundLevelingConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setGroundLevelingConstructionScheduleForTimeFlag(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleVO.getGlcsId());
		
		groundLevelingConstructionSchedulePO.setEndTimeFlag(groundLevelingConstructionScheduleVO.getEndTimeFlag());
		groundLevelingConstructionSchedulePO.setStartTimeFlag(groundLevelingConstructionScheduleVO.getStartTimeFlag());
		
		groundLevelingConstructionScheduleDao.update(groundLevelingConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setGroundLevelingConstructionScheduleForInfo(GroundLevelingConstructionScheduleVO groundLevelingConstructionScheduleVO){
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.get(groundLevelingConstructionScheduleVO.getGlcsId());
		
		groundLevelingConstructionSchedulePO.setWorkerId(groundLevelingConstructionScheduleVO.getWorkerId());
		groundLevelingConstructionSchedulePO.setEndTime(groundLevelingConstructionScheduleVO.getEndTime());
		groundLevelingConstructionSchedulePO.setStartTime(groundLevelingConstructionScheduleVO.getStartTime());
		
		groundLevelingConstructionScheduleDao.update(groundLevelingConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setGroundLevelingConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int glcswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		GroundLevelingConstructionScheduleWorkerPO groundLevelingConstructionScheduleWorkerPO = groundLevelingConstructionScheduleWorkerDao.get(glcswId);
		
		if(groundLevelingConstructionScheduleWorkerPO != null){
			
			groundLevelingConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(groundLevelingConstructionScheduleWorkerPO.getGlcswId(), GroundLevelingConstructionSchedulePO.GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(groundLevelingConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(groundLevelingConstructionScheduleWorkerPO.getGlcswId());
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(GroundLevelingConstructionSchedulePO.GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(GroundLevelingConstructionSchedulePO.GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			groundLevelingConstructionScheduleWorkerDao.update(groundLevelingConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setGroundLevelingConstructionScheduleWorkerForRaty(List<GroundLevelingConstructionScheduleWorkerVO> constructionScheduleWorkers){
		
		for(GroundLevelingConstructionScheduleWorkerVO groundLevelingConstructionScheduleWorkerVO: constructionScheduleWorkers){
			GroundLevelingConstructionScheduleWorkerPO groundLevelingConstructionScheduleWorkerPO = groundLevelingConstructionScheduleWorkerDao.get(groundLevelingConstructionScheduleWorkerVO.getGlcswId());
			
			if(groundLevelingConstructionScheduleWorkerPO != null){
				groundLevelingConstructionScheduleWorkerPO.setWorkerRaty(groundLevelingConstructionScheduleWorkerVO.getWorkerRaty());
				groundLevelingConstructionScheduleWorkerPO.setWorkerRatyDes(groundLevelingConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				groundLevelingConstructionScheduleWorkerDao.update(groundLevelingConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteGroundLevelingConstructionScheduleWorker(GroundLevelingConstructionScheduleWorkerVO groundLevelingConstructionScheduleWorkerVO) throws FLException {
		
		int glcswId = groundLevelingConstructionScheduleWorkerVO.getGlcswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		GroundLevelingConstructionScheduleWorkerPO groundLevelingConstructionScheduleWorkerPO = groundLevelingConstructionScheduleWorkerDao.get(glcswId);
		
		if(groundLevelingConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(groundLevelingConstructionScheduleWorkerPO.getGlcswId(), GroundLevelingConstructionSchedulePO.GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}else{
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}
			}
			
			groundLevelingConstructionScheduleWorkerDao.delete(groundLevelingConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

}
