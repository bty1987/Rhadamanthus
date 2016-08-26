/**
 * @File Name		: ChanConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ChanConstructionScheduleDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.service.ChanConstructionScheduleService;
import com.fanglin.construction.vo.ChanConstructionScheduleVO;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.drawline.dao.DrawLineDao;
import com.fanglin.drawline.po.DrawLinePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("chanConstructionScheduleService")
@Transactional(readOnly=true)
public class ChanConstructionScheduleServiceImpl implements ChanConstructionScheduleService {
	
	@Autowired
	private ChanConstructionScheduleDao chanConstructionScheduleDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private DrawLineDao drawLineDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public ChanConstructionScheduleVO queryChanConstructionScheduleById(int ccsId){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(ccsId);
		ChanConstructionScheduleVO chanConstructionScheduleVO = new ChanConstructionScheduleVO();
		
		BeanUtil.copyProperties(chanConstructionSchedulePO, chanConstructionScheduleVO);
		
		return chanConstructionScheduleVO;
	}

	@Override
	public ChanConstructionScheduleVO queryChanConstructionScheduleByOrderId(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(chanConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(chanConstructionSchedulePO, chanConstructionScheduleVO);
		
		String workerId = chanConstructionSchedulePO.getWorkerId();
		
		if(workerId != null && !"".equals(workerId)){
			UserPO userPO = userDao.get(workerId);
			
			if(userPO != null){
				chanConstructionScheduleVO.setWorkerName(userPO.getCurrentName());
				chanConstructionScheduleVO.setWorkerOldId(userPO.getOldUserId());
				chanConstructionScheduleVO.setWorkerDuty(userPO.getDuty());
				chanConstructionScheduleVO.setWorkerPhone(userPO.getPhone());
				chanConstructionScheduleVO.setWorkerPhoto(userPO.getUserPhoto());
			}
		}
		
		return chanConstructionScheduleVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateChanConstructionSchedule(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(chanConstructionScheduleVO.getOrderId());
		
		if(chanConstructionScheduleDao == null){
			chanConstructionSchedulePO = new ChanConstructionSchedulePO();
			chanConstructionSchedulePO.setStartTime(DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			chanConstructionSchedulePO.setEndTime(DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}
		
		BeanUtil.copyProperties(chanConstructionScheduleVO, chanConstructionSchedulePO);
		chanConstructionScheduleDao.saveOrUpdate(chanConstructionSchedulePO);
		
		return chanConstructionSchedulePO.getCcsId();

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForTimeFlag(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		chanConstructionSchedulePO.setEndTimeFlag(chanConstructionScheduleVO.getEndTimeFlag());
		chanConstructionSchedulePO.setStartTimeFlag(chanConstructionScheduleVO.getStartTimeFlag());
		
		chanConstructionScheduleDao.update(chanConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForStatus(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		int status = chanConstructionScheduleVO.getStatus();
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		if(chanConstructionSchedulePO != null){
			chanConstructionSchedulePO.setStatus(status);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(chanConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null){
				constructionSchedulePO.setChanStatus(status);
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			if(status == ChanConstructionSchedulePO.STATUS_TYPE_FAIL_INT){
				List<DrawLinePO> drawLinePOs  = drawLineDao.queryDrawLineByOrderId(chanConstructionSchedulePO.getOrderId());
				if(drawLinePOs != null && drawLinePOs .size() > 0){
					drawLinePOs.get(0).setStatus("放线失败");
					drawLineDao.update(drawLinePOs.get(0));
				}
			}
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForInfo(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		if(chanConstructionSchedulePO != null){
			chanConstructionSchedulePO.setEndTime(chanConstructionScheduleVO.getEndTime());
			chanConstructionSchedulePO.setStartTime(chanConstructionScheduleVO.getStartTime());
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleWorker(ChanConstructionScheduleVO chanConstructionScheduleVO) throws FLException{
		
		int ccsId = chanConstructionScheduleVO.getCcsId();
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(ccsId);
		
		if(chanConstructionSchedulePO != null){
			
			String workerId = chanConstructionScheduleVO.getWorkerId();
			
			if("".equals(workerId)){
				WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(ccsId, ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				
				List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
				
				if(workerBaseSalaryPO != null){
					if(!status.contains(workerBaseSalaryPO.getStatus())){
						throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
					}else{
						workerBaseSalaryDao.delete(workerBaseSalaryPO);
					}
				}
				
				chanConstructionSchedulePO.setWorkerId("");
				chanConstructionSchedulePO.setAllocateTime(null);
				
			}else{
				chanConstructionSchedulePO.setWorkerId(workerId);
				chanConstructionSchedulePO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
				
				ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(chanConstructionSchedulePO.getCsId());
				
				if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & ChanConstructionSchedulePO.CHAN_ALLOCATION_WORKER_FLAG_INT) == 0){
					constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + ChanConstructionSchedulePO.CHAN_ALLOCATION_WORKER_FLAG_INT);
					
					constructionScheduleDao.update(constructionSchedulePO);
				}
				
				UserPO userPO = userDao.get(workerId);
				if(userPO != null){
					chanConstructionScheduleVO.setWorkerOldId(userPO.getOldUserId());
					chanConstructionScheduleVO.setWorkerName(userPO.getCurrentName());
					chanConstructionScheduleVO.setWorkerDuty(userPO.getDuty());
					chanConstructionScheduleVO.setWorkerPhoto(userPO.getUserPhoto());
				}
			}
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setChanConstructionScheduleForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int ccsId = constructionScheduleWorkerVO.getPcsId();
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(ccsId);
		
		if(chanConstructionSchedulePO != null){
			
			chanConstructionSchedulePO.setWorkerSalary(constructionScheduleWorkerVO.getWorkerSalary());
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(ccsId, ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(chanConstructionSchedulePO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(ccsId);
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setChanConstructionScheduleForService(ChanConstructionScheduleVO chanConstructionScheduleVO){
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.get(chanConstructionScheduleVO.getCcsId());
		
		chanConstructionSchedulePO.setWorkerRaty(chanConstructionScheduleVO.getWorkerRaty());
		chanConstructionSchedulePO.setWorkerRatyDes(chanConstructionScheduleVO.getWorkerRatyDes());
		
		chanConstructionScheduleDao.update(chanConstructionSchedulePO);
	}

}
