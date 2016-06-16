/**
 * @File Name		: OilConstructionScheduleServiceImpl.java
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
import com.fanglin.construction.dao.OilConstructionScheduleDao;
import com.fanglin.construction.dao.OilConstructionScheduleWorkerDao;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionScheduleWorkerPO;
import com.fanglin.construction.service.OilConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleWorkerVO;
import com.fanglin.construction.vo.OilConstructionScheduleVO;
import com.fanglin.construction.vo.OilConstructionScheduleWorkerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("oilConstructionScheduleService")
@Transactional(readOnly=true)
public class OilConstructionScheduleServiceImpl implements OilConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private OilConstructionScheduleDao oilConstructionScheduleDao;
	
	@Autowired
	private OilConstructionScheduleWorkerDao oilConstructionScheduleWorkerDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public OilConstructionScheduleVO queryOilConstructionScheduleById(int ocsId){
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(ocsId);
		OilConstructionScheduleVO oilConstructionScheduleVO = new OilConstructionScheduleVO();
		
		BeanUtil.copyProperties(oilConstructionSchedulePO, oilConstructionScheduleVO);
		
		return oilConstructionScheduleVO;
	}

	@Override
	public OilConstructionScheduleVO queryOilConstructionScheduleByOrderId(OilConstructionScheduleVO oilConstructionScheduleVO){
		
		if(oilConstructionScheduleVO == null){
			return null;
		}
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.queryConstructionScheduleByOrderId(oilConstructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(oilConstructionSchedulePO, oilConstructionScheduleVO);
		
		return oilConstructionScheduleVO;
	}
	
	@Override
	public List<OilConstructionScheduleWorkerVO> queryOilConstructionScheduleWorkerByOcsId(OilConstructionScheduleVO oilConstructionScheduleVO){
		
		List<OilConstructionScheduleWorkerPO> oilConstructionScheduleWorkerPOs = oilConstructionScheduleWorkerDao.queryOilConstructionScheduleWorkerByOcsId(oilConstructionScheduleVO.getOcsId());
		List<OilConstructionScheduleWorkerVO> oilConstructionScheduleWorkerVOs = new ArrayList<OilConstructionScheduleWorkerVO>();
		
		for(OilConstructionScheduleWorkerPO oilConstructionScheduleWorkerPO: oilConstructionScheduleWorkerPOs){
			OilConstructionScheduleWorkerVO oilConstructionScheduleWorkerVO = new OilConstructionScheduleWorkerVO();
			BeanUtil.copyProperties(oilConstructionScheduleWorkerPO, oilConstructionScheduleWorkerVO);
			
			UserPO userPO = userDao.get(oilConstructionScheduleWorkerPO.getWorkerId());
			if(userPO != null){
				oilConstructionScheduleWorkerVO.setWorkerPhone(userPO.getPhone());
				oilConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
				oilConstructionScheduleWorkerVO.setWorkerOldId(userPO.getOldUserId());
				oilConstructionScheduleWorkerVO.setWorkerDuty(userPO.getDuty());
			}
			
			oilConstructionScheduleWorkerVOs.add(oilConstructionScheduleWorkerVO);
		}
		
		return oilConstructionScheduleWorkerVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveOrUpdateOilConstructionSchedule(OilConstructionScheduleVO oilConstructionScheduleVO){
		
		OilConstructionSchedulePO oilConstructionSchedulePO = null;
		
		if(oilConstructionScheduleVO.getOcsId() == 0){
			oilConstructionSchedulePO = new OilConstructionSchedulePO();
			oilConstructionSchedulePO.setEndTime(DateUtil.current(OilConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
			oilConstructionSchedulePO.setStartTime(DateUtil.current(OilConstructionSchedulePO.CURRENT_TIME_FORMAT_STR));
		}else{
			oilConstructionSchedulePO = oilConstructionScheduleDao.get(oilConstructionScheduleVO.getOcsId());
		}
		
		BeanUtil.copyProperties(oilConstructionScheduleVO, oilConstructionSchedulePO);
		oilConstructionScheduleDao.saveOrUpdate(oilConstructionSchedulePO);

		return oilConstructionSchedulePO.getOcsId();
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addOilConstructionScheduleWorker(OilConstructionScheduleWorkerVO oilConstructionScheduleWorkerVO) throws FLException{
		
		String workerId = oilConstructionScheduleWorkerVO.getWorkerId();
		
		List<OilConstructionScheduleWorkerPO> oilConstructionScheduleWorkerPOs = oilConstructionScheduleWorkerDao.queryOilConstructionScheduleWorkerByOcsIdAWorkerId(oilConstructionScheduleWorkerVO.getOcsId(), oilConstructionScheduleWorkerVO.getWorkerId());
		
		if(oilConstructionScheduleWorkerPOs.size() > 0){
			throw new FLException(120001, "当前工人已经添加,不能重复添加同一工人");
		}
		
		OilConstructionScheduleWorkerPO oilConstructionScheduleWorkerPO = new OilConstructionScheduleWorkerPO();
		BeanUtil.copyProperties(oilConstructionScheduleWorkerVO, oilConstructionScheduleWorkerPO);
		
		oilConstructionScheduleWorkerPO.setWorkerRatyDes("");
		oilConstructionScheduleWorkerPO.setAllocateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(workerId);
		if(userPO != null){
			oilConstructionScheduleWorkerPO.setWorkerName(userPO.getCurrentName());
			oilConstructionScheduleWorkerVO.setWorkerPhoto(userPO.getUserPhoto());
		}
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(oilConstructionScheduleWorkerVO.getOcsId());
		if(oilConstructionSchedulePO != null && ("".equals(oilConstructionSchedulePO.getWorkerId()) || oilConstructionSchedulePO.getWorkerId() == null)){
			oilConstructionSchedulePO.setWorkerId(workerId);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(oilConstructionSchedulePO.getCsId());
			if(constructionSchedulePO != null && (constructionSchedulePO.getAllocationWorkerFlag() & OilConstructionSchedulePO.OIL_ALLOCATION_WORKER_FLAG_INT) == 0){
				constructionSchedulePO.setAllocationWorkerFlag(constructionSchedulePO.getAllocationWorkerFlag() + OilConstructionSchedulePO.OIL_ALLOCATION_WORKER_FLAG_INT);
				
				constructionScheduleDao.update(constructionSchedulePO);
			}
			
			oilConstructionScheduleDao.update(oilConstructionSchedulePO);
		}
		
		oilConstructionScheduleWorkerDao.saveOrUpdate(oilConstructionScheduleWorkerPO);
		
		BeanUtil.copyProperties(oilConstructionScheduleWorkerPO, oilConstructionScheduleWorkerVO, Arrays.asList("userPhoto"));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setOilConstructionScheduleForTimeFlag(OilConstructionScheduleVO oilConstructionScheduleVO){
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(oilConstructionScheduleVO.getOcsId());
		
		oilConstructionSchedulePO.setEndTimeFlag(oilConstructionScheduleVO.getEndTimeFlag());
		oilConstructionSchedulePO.setStartTimeFlag(oilConstructionScheduleVO.getStartTimeFlag());
		
		oilConstructionScheduleDao.update(oilConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setOilConstructionScheduleForInfo(OilConstructionScheduleVO oilConstructionScheduleVO){

		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.get(oilConstructionScheduleVO.getOcsId());
		
		oilConstructionSchedulePO.setWorkerId(oilConstructionScheduleVO.getWorkerId());
		oilConstructionSchedulePO.setEndTime(oilConstructionScheduleVO.getEndTime());
		oilConstructionSchedulePO.setStartTime(oilConstructionScheduleVO.getStartTime());
		
		oilConstructionScheduleDao.update(oilConstructionSchedulePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int setOilConstructionScheduleWorkerForSalary(ConstructionScheduleWorkerVO constructionScheduleWorkerVO) throws FLException{
		
		int ocswId = constructionScheduleWorkerVO.getPcswId();
		float workerSalary = constructionScheduleWorkerVO.getWorkerSalary();
		
		OilConstructionScheduleWorkerPO oilConstructionScheduleWorkerPO = oilConstructionScheduleWorkerDao.get(ocswId);
		
		if(oilConstructionScheduleWorkerPO != null){
			
			oilConstructionScheduleWorkerPO.setWorkerSalary(workerSalary);
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(oilConstructionScheduleWorkerPO.getOcswId(), OilConstructionSchedulePO.OIL_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO == null){
				workerBaseSalaryPO = new WorkerBaseSalaryPO();
				BeanUtil.copyProperties(oilConstructionScheduleWorkerPO, workerBaseSalaryPO);
				workerBaseSalaryPO.setCswId(oilConstructionScheduleWorkerPO.getOcswId());
				workerBaseSalaryPO.setUserId(constructionScheduleWorkerVO.getWorkerId());
				workerBaseSalaryPO.setUserName(constructionScheduleWorkerVO.getWorkerName());
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
				workerBaseSalaryPO.setWorkTypeId(OilConstructionSchedulePO.OIL_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
				workerBaseSalaryPO.setWorkType(OilConstructionSchedulePO.OIL_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
				workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			}else if(workerBaseSalaryPO.getStatus() != WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				throw new FLException(120002, "当前工人工资已经完成确认,不能进行修改");
			}else if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
				workerBaseSalaryPO.setBase(constructionScheduleWorkerVO.getWorkerSalary());
			}
			
			workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
			
			oilConstructionScheduleWorkerDao.update(oilConstructionScheduleWorkerPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void setOilConstructionScheduleWorkerForRaty(List<OilConstructionScheduleWorkerVO> constructionScheduleWorkers){
		
		for(OilConstructionScheduleWorkerVO oilConstructionScheduleWorkerVO: constructionScheduleWorkers){
			OilConstructionScheduleWorkerPO oilConstructionScheduleWorkerPO = oilConstructionScheduleWorkerDao.get(oilConstructionScheduleWorkerVO.getOcswId());
			
			if(oilConstructionScheduleWorkerPO != null){
				oilConstructionScheduleWorkerPO.setWorkerRaty(oilConstructionScheduleWorkerVO.getWorkerRaty());
				oilConstructionScheduleWorkerPO.setWorkerRatyDes(oilConstructionScheduleWorkerVO.getWorkerRatyDes());
				
				oilConstructionScheduleWorkerDao.update(oilConstructionScheduleWorkerPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteOilConstructionScheduleWorker(OilConstructionScheduleWorkerVO oilConstructionScheduleWorkerVO) throws FLException {
		
		int ocswId = oilConstructionScheduleWorkerVO.getOcswId();
		
		List<Integer> status = Arrays.asList(new Integer[]{WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT, WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT});
		
		OilConstructionScheduleWorkerPO oilConstructionScheduleWorkerPO = oilConstructionScheduleWorkerDao.get(ocswId);
		
		if(oilConstructionScheduleWorkerPO != null){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.queryWorkerBaseSalaryByCswIdWorkTypeId(oilConstructionScheduleWorkerPO.getOcswId(), OilConstructionSchedulePO.OIL_CONSTRUCTION_SCHEDULE_TYPE_ID_INT);
			
			if(workerBaseSalaryPO != null){
				if(!status.contains(workerBaseSalaryPO.getStatus())){
					throw new FLException(120003, "当前工人工资已经处理,不能进行删除");
				}else{
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}
			}
			
			oilConstructionScheduleWorkerDao.delete(oilConstructionScheduleWorkerPO);
		}
		
		return 0;
	}
	
}
