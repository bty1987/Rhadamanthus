/**
 * @File Name		: BricklayConstructionScheduleServiceImpl.java
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

import com.fanglin.construction.dao.BricklayConstructionScheduleDao;
import com.fanglin.construction.dao.BricklayConstructionScheduleWorkerDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.BricklayConstructionScheduleWorkerPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.BricklayConstructionScheduleService;
import com.fanglin.construction.vo.BricklayConstructionScheduleVO;
import com.fanglin.construction.vo.BricklayConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("bricklayConstructionScheduleService")
@Transactional(readOnly=true)
public class BricklayConstructionScheduleServiceImpl implements BricklayConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private BricklayConstructionScheduleDao bricklayConstructionScheduleDao;
	
	@Autowired
	private BricklayConstructionScheduleWorkerDao bricklayConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleById(int bcsId){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(Integer.valueOf(bcsId));
		BricklayConstructionScheduleVO bricklayConstructionScheduleVO = new BricklayConstructionScheduleVO();
		
		BeanUtil.copyProperties(bricklayConstructionSchedulePO, bricklayConstructionScheduleVO);
		
		return bricklayConstructionScheduleVO;
	}

	@Override
	public BricklayConstructionScheduleVO queryBricklayConstructionScheduleByOrderId(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByOrderId(bricklayConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(bricklayConstructionSchedulePO, bricklayConstructionScheduleVO);
		
		return bricklayConstructionScheduleVO;
	}

	@Override
	public List<BricklayConstructionScheduleWorkerVO> queryBricklayConstructionScheduleWorkerByBcsId(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		List<BricklayConstructionScheduleWorkerPO> BricklayConstructionScheduleWorkerPOs = bricklayConstructionScheduleWorkerDao.queryBricklayConstructionScheduleWorkerByBcsId(bricklayConstructionScheduleVO.getBcsId());
		List<BricklayConstructionScheduleWorkerVO> bricklayConstructionScheduleWorkerVOs = new ArrayList<BricklayConstructionScheduleWorkerVO>();
		
		for(BricklayConstructionScheduleWorkerPO bricklayConstructionScheduleWorkerPO: BricklayConstructionScheduleWorkerPOs){
			BricklayConstructionScheduleWorkerVO bricklayConstructionScheduleWorkerVO = new BricklayConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(bricklayConstructionScheduleWorkerPO, bricklayConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(bricklayConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				bricklayConstructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
				bricklayConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				bricklayConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				bricklayConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			bricklayConstructionScheduleWorkerVOs.add(bricklayConstructionScheduleWorkerVO);
		}
		
		return bricklayConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateBricklayConstructionSchedule(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = null;
		
		if(bricklayConstructionScheduleVO.getBcsId() == 0){
			bricklayConstructionSchedulePO = new BricklayConstructionSchedulePO();
			bricklayConstructionSchedulePO.setEndTime(DateUtil.current(BricklayConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			bricklayConstructionSchedulePO.setStartTime(DateUtil.current(BricklayConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByOrderId(bricklayConstructionScheduleVO.getOrderId());
		}
		
		BeanUtil.copyProperties(bricklayConstructionScheduleVO, bricklayConstructionSchedulePO);
		bricklayConstructionScheduleDao.saveOrUpdate(bricklayConstructionSchedulePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setBricklayConstructionScheduleForTimeFlag(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(bricklayConstructionScheduleVO.getBcsId());
		
		bricklayConstructionSchedulePO.setEndTimeFlag(bricklayConstructionScheduleVO.getEndTimeFlag());
		bricklayConstructionSchedulePO.setStartTimeFlag(bricklayConstructionScheduleVO.getStartTimeFlag());
		
		bricklayConstructionScheduleDao.update(bricklayConstructionSchedulePO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setBricklayConstructionScheduleForInfo(BricklayConstructionScheduleVO bricklayConstructionScheduleVO){
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(bricklayConstructionScheduleVO.getBcsId());
		
		bricklayConstructionSchedulePO.setStartTime(bricklayConstructionScheduleVO.getStartTime());
		bricklayConstructionSchedulePO.setEndTime(bricklayConstructionScheduleVO.getEndTime());
		
		bricklayConstructionScheduleDao.update(bricklayConstructionSchedulePO);
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addBricklayConstructionScheduleWorker(BricklayConstructionScheduleWorkerVO bricklayConstructionScheduleWorkerVO) throws FLException{
		
		String workerId = bricklayConstructionScheduleWorkerVO.getWorkerId();
		
		List<BricklayConstructionScheduleWorkerPO> bricklayConstructionScheduleWorkerPOs = bricklayConstructionScheduleWorkerDao.queryBricklayConstructionScheduleWorkerByBcsIdAWorkerId(bricklayConstructionScheduleWorkerVO.getBcsId(), workerId);
		
		if(bricklayConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		BricklayConstructionScheduleWorkerPO bricklayConstructionScheduleWorkerPO = new BricklayConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(bricklayConstructionScheduleWorkerVO, bricklayConstructionScheduleWorkerPO);
		
		bricklayConstructionScheduleWorkerPO.setWorkerRatyDes("");
		bricklayConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			bricklayConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			bricklayConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
		}
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.get(bricklayConstructionScheduleWorkerVO.getBcsId());
		if(bricklayConstructionSchedulePO != null && ("".equals(bricklayConstructionSchedulePO.getWorkerId()) || bricklayConstructionSchedulePO.getWorkerId() == null)){
			bricklayConstructionSchedulePO.setWorkerId(workerId);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(bricklayConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & BricklayConstructionSchedulePO.BRICKLAY_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + BricklayConstructionSchedulePO.BRICKLAY_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			bricklayConstructionScheduleDao.update(bricklayConstructionSchedulePO);
		}
		
		bricklayConstructionScheduleWorkerDao.saveOrUpdate(bricklayConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(bricklayConstructionScheduleWorkerPO, bricklayConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setBricklayConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int bcswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		BricklayConstructionScheduleWorkerPO bricklayConstructionScheduleWorkerPO = bricklayConstructionScheduleWorkerDao.get(bcswId);
		
		if(bricklayConstructionScheduleWorkerPO != null){
			
			bricklayConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(bcswId, BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(bricklayConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(bricklayConstructionScheduleWorkerPO.getBcswId());
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			bricklayConstructionScheduleWorkerDao.update(bricklayConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setBricklayConstructionScheduleWorkerForRaty(List<BricklayConstructionScheduleWorkerVO> constructionScheduleWorkers){
		
		for(BricklayConstructionScheduleWorkerVO bricklayConstructionScheduleWorkerVO: constructionScheduleWorkers){
			BricklayConstructionScheduleWorkerPO bricklayConstructionScheduleWorkerPO = bricklayConstructionScheduleWorkerDao.get(bricklayConstructionScheduleWorkerVO.getBcswId());
			
			if(bricklayConstructionScheduleWorkerPO != null){
				bricklayConstructionScheduleWorkerPO.setWorkerRaty(bricklayConstructionScheduleWorkerVO.getWorkerRaty());
				bricklayConstructionScheduleWorkerPO.setWorkerRatyDes(bricklayConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				bricklayConstructionScheduleWorkerDao.update(bricklayConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteBricklayConstructionScheduleWorker(BricklayConstructionScheduleWorkerVO bricklayConstructionScheduleWorkerVO) throws FLException {
		
		int bcswId = bricklayConstructionScheduleWorkerVO.getBcswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		BricklayConstructionScheduleWorkerPO bricklayConstructionScheduleWorkerPO = bricklayConstructionScheduleWorkerDao.get(bcswId);
		
		if(bricklayConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(bcswId, BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}else{
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}
			}
			
			bricklayConstructionScheduleWorkerDao.delete(bricklayConstructionScheduleWorkerPO);
		}
		
		return 0;
	}
	
}