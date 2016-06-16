/**
 * @File Name		: WorkerDeductSalaryServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerDeductSalaryDao;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerDeductSalaryPO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerDeductSalaryService;
import com.fanglin.salary.vo.WorkerDeductSalaryVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("workerDeductSalaryService")
@Transactional(readOnly=true)
public class WorkerDeductSalaryServiceImpl implements WorkerDeductSalaryService {
	
	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	@Autowired
	private WorkerDeductSalaryDao workerDeductSalaryDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void pageWorkerDeductSalaryByOrderIdAUserId(Paging paging, List<FilterVO> filters, WorkerDeductSalaryVO workerDeductSalaryVO, String userId){
		
		UserPO userPO = userDao.get(userId);
		String duty = userPO.getDuty();
		
		if(duty.contains("质检")){
			
			int workType = 0;
			
			if(duty.contains(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 1;
			}else if(duty.contains(PutlineConstructionSchedulePO.PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 2;
			}else if(duty.contains(WaterwayCircuitPowerConstructionScheduleWorkerPO.WATERWAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 3;
			}else if(duty.contains(WaterwayCircuitPowerConstructionScheduleWorkerPO.POWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 4;
			}else if(duty.contains(WaterwayCircuitPowerConstructionScheduleWorkerPO.CIRCUIT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 5;
			}else if(duty.contains(BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 6;
			}else if(duty.contains(GroundLevelingConstructionSchedulePO.GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 7;
			}else if(duty.contains(CarpentConstructionSchedulePO.CARPENT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 8;
			}else if(duty.contains(OilConstructionSchedulePO.OIL_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 9;
			}else if(duty.contains(CleaningConstructionSchedulePO.CLEANING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR)){
				workType = 10;
			}
			
			if(workType != 0){
				filters.add(new FilterVO("workTypeId", String.valueOf(workType), "eq"));
			}
		}
		
		List<WorkerDeductSalaryPO> workerDeductSalaryPOs = workerDeductSalaryDao.pageWorkerDeductSalaryByOrderId(paging, filters, workerDeductSalaryVO.getOrderId());
		List<WorkerDeductSalaryVO> workerDeductSalaryVOs = new ArrayList<WorkerDeductSalaryVO>();
		
		for(WorkerDeductSalaryPO workerDeductSalaryPO: workerDeductSalaryPOs){
			WorkerDeductSalaryVO _workerDeductSalaryVO = new WorkerDeductSalaryVO();
			BeanUtil.copyProperties(workerDeductSalaryPO, _workerDeductSalaryVO);
			
			workerDeductSalaryVOs.add(_workerDeductSalaryVO);
		}
		
		paging.setData(workerDeductSalaryVOs);
	}

	@Override
	public void pageWorkerDedectSalaryByPass(Paging paging, List<FilterVO> filters){
		
		List<Integer> status = new ArrayList<Integer>();
		status.add(WorkerDeductSalaryPO.STATUS_TYPE_PASS_INT);
		status.add(WorkerDeductSalaryPO.STATUS_TYPE_CONFIRM_INT);
		status.add(WorkerDeductSalaryPO.STATUS_TYPE_PAYOFF_INT);
		status.add(WorkerDeductSalaryPO.STATUS_TYPE_DELETE_INT);
		
		List<WorkerDeductSalaryPO> workerDeductSalaryPOs = workerDeductSalaryDao.pageWorkerBaseSalary(paging, filters, status);
		List<WorkerDeductSalaryVO> workerDeductSalaryVOs = new ArrayList<WorkerDeductSalaryVO>();
		
		for(WorkerDeductSalaryPO workerDeductSalaryPO: workerDeductSalaryPOs){
			WorkerDeductSalaryVO _workerDeductSalaryVO = new WorkerDeductSalaryVO();
			BeanUtil.copyProperties(workerDeductSalaryPO, _workerDeductSalaryVO);
			
			workerDeductSalaryVOs.add(_workerDeductSalaryVO);
		}
		
		paging.setData(workerDeductSalaryVOs);
	}

	@Override
	public void pageWorkerDeductSalaryForPersonal(Paging paging, List<FilterVO> filters, WorkerDeductSalaryVO workerDeductSalaryVO){
		
		List<WorkerDeductSalaryPO> workerDeductSalaryPOs = workerDeductSalaryDao.pageWorkerDeductSalaryPersonal(paging, filters);
		List<WorkerDeductSalaryVO> workerDeductSalaryVOs = new ArrayList<WorkerDeductSalaryVO>();
		
		for(WorkerDeductSalaryPO workerDeductSalaryPO: workerDeductSalaryPOs){
			WorkerDeductSalaryVO _workerDeductSalaryVO = new WorkerDeductSalaryVO();
			BeanUtil.copyProperties(workerDeductSalaryPO, _workerDeductSalaryVO);
			
			workerDeductSalaryVOs.add(_workerDeductSalaryVO);
		}
		
		paging.setData(workerDeductSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addWorderDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO){
		
		WorkerDeductSalaryPO workerDeductSalaryPO = new WorkerDeductSalaryPO();
		BeanUtil.copyProperties(workerDeductSalaryVO, workerDeductSalaryPO);
		workerDeductSalaryPO.setCreateTime(DateUtil.current(WorkerDeductSalaryPO.CURRENT_TIME_FORMAT_STR));
		
		workerDeductSalaryDao.saveOrUpdate(workerDeductSalaryPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateWorderDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO){
		
		WorkerDeductSalaryPO workerDeductSalaryPO = workerDeductSalaryDao.get(workerDeductSalaryVO.getWdsId());
		
		if(workerDeductSalaryPO != null && workerDeductSalaryPO.getStatus() == WorkerDeductSalaryPO.STATUS_TYPE_INIT_INT){
			
			workerDeductSalaryPO.setUserId(workerDeductSalaryVO.getUserId());
			workerDeductSalaryPO.setUserName(workerDeductSalaryVO.getUserName());
			workerDeductSalaryPO.setDeduct(workerDeductSalaryVO.getDeduct());
			workerDeductSalaryPO.setWorkType(workerDeductSalaryVO.getWorkType());
			
			workerDeductSalaryDao.update(workerDeductSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void passWorderDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO){
		
		WorkerDeductSalaryPO workerDeductSalaryPO = workerDeductSalaryDao.get(workerDeductSalaryVO.getWdsId());
		
		if(workerDeductSalaryPO != null && workerDeductSalaryPO.getStatus() == WorkerDeductSalaryPO.STATUS_TYPE_INIT_INT){
			workerDeductSalaryPO.setStatus(WorkerDeductSalaryPO.STATUS_TYPE_PASS_INT);
			workerDeductSalaryDao.update(workerDeductSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void confirmWorkerDeductSalary(WorkerDeductSalaryVO workerDeductSalaryVO){
		
		WorkerDeductSalaryPO workerDeductSalaryPO = workerDeductSalaryDao.get(workerDeductSalaryVO.getWdsId());
		
		if(workerDeductSalaryPO != null && workerDeductSalaryPO.getStatus() == WorkerDeductSalaryPO.STATUS_TYPE_PASS_INT){
			workerDeductSalaryPO.setStatus(WorkerDeductSalaryPO.STATUS_TYPE_CONFIRM_INT);
			
			WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByUserIdInit(workerDeductSalaryPO.getUserId());
			if(workerSalaryPO != null){
				workerSalaryPO.setDeduct(Arith.add(workerSalaryPO.getDeduct(), Math.abs(workerDeductSalaryPO.getDeduct())));
			}else{
				workerSalaryPO = new WorkerSalaryPO();
				BeanUtil.copyProperties(workerDeductSalaryVO, workerSalaryPO);
				workerSalaryPO.setCreateTime(DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerSalaryPO.setEndTime(DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerSalaryPO.setDeduct(workerDeductSalaryVO.getDeduct());
				workerSalaryPO.setWorkTypeId(workerDeductSalaryVO.getWorkTypeId());
				workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_TYPE_INIT_INT);
			}
			
			workerSalaryDao.saveOrUpdate(workerSalaryPO);
			
			workerDeductSalaryPO.setWsId(workerSalaryPO.getWsId());
				
			workerDeductSalaryDao.update(workerDeductSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void cancelWorkerDeductSalaryToInit(WorkerDeductSalaryVO workerDeductSalaryVO){
		
		WorkerDeductSalaryPO workerDeductSalaryPO = workerDeductSalaryDao.get(workerDeductSalaryVO.getWdsId());
		
		if(workerDeductSalaryPO != null && workerDeductSalaryPO.getStatus() == WorkerDeductSalaryPO.STATUS_TYPE_PASS_INT){
			workerDeductSalaryPO.setStatus(WorkerDeductSalaryPO.STATUS_TYPE_INIT_INT);
			workerDeductSalaryDao.update(workerDeductSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void cancelWorkerDeductSalaryToConfirm(WorkerDeductSalaryVO workerDeductSalaryVO){

		WorkerDeductSalaryPO workerDeductSalaryPO = workerDeductSalaryDao.get(workerDeductSalaryVO.getWdsId());
		
		if(workerDeductSalaryPO != null && workerDeductSalaryPO.getStatus() == WorkerDeductSalaryPO.STATUS_TYPE_PASS_INT){
			workerDeductSalaryPO.setStatus(WorkerDeductSalaryPO.STATUS_TYPE_DELETE_INT);
			
			workerDeductSalaryDao.update(workerDeductSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteWorkerDeductSalarys(List<Integer> wdsIds){
		
		int flag = 0;
		
		for(int wdsId: wdsIds){
			
			WorkerDeductSalaryPO workerDeductSalaryPO = workerDeductSalaryDao.get(wdsId);
			if(workerDeductSalaryPO != null){
				if(workerDeductSalaryPO.getStatus() == WorkerDeductSalaryPO.STATUS_TYPE_INIT_INT){
					workerDeductSalaryDao.delete(workerDeductSalaryPO);
				}else{
					flag = 1;
				}
			}
		}
		
		return flag;
	}
}
