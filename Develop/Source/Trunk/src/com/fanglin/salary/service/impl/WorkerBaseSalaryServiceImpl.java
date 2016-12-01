/**
 * @File Name		: WorkerBaseSalaryServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionScheduleWorkerPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerBaseSalaryService;
import com.fanglin.salary.vo.WorkerBaseSalaryVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("workerBaseSalaryService")
@Transactional(readOnly=true)
public class WorkerBaseSalaryServiceImpl implements WorkerBaseSalaryService {
	
	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MessageDao messageDao;
	
	@Override
	public void pageWorkerBaseSalaryByOrderIdAUserId(Paging paging, List<Filter> filters, WorkerBaseSalaryVO workerBaseSalaryVO, String userId){
		
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
				filters.add(new Filter(WorkerBaseSalaryPO.COLUMN_WORKTYPEID_STR, String.valueOf(workType), "eq"));
			}
		}
		
		List<WorkerBaseSalaryPO> workerBaseSalaryPOs = workerBaseSalaryDao.pageWorkerBaseSalaryByOrderId(paging, filters, workerBaseSalaryVO.getOrderId());
		List<WorkerBaseSalaryVO> workerBaseSalaryVOs = new ArrayList<WorkerBaseSalaryVO>();
		
		for(WorkerBaseSalaryPO workerBaseSalaryPO: workerBaseSalaryPOs){
			WorkerBaseSalaryVO _workerBaseSalaryVO = new WorkerBaseSalaryVO();
			BeanUtil.copyProperties(workerBaseSalaryPO, _workerBaseSalaryVO);
			workerBaseSalaryVOs.add(_workerBaseSalaryVO);
		}
		
		paging.setData(workerBaseSalaryVOs);
	}
	
	@Override
	public void pageWorkerBaseSalary(Paging paging, List<Filter> filters){
		
		List<WorkerBaseSalaryPO> workerBaseSalaryPOs = workerBaseSalaryDao.pageWorkerBaseSalary(paging, filters);
		List<WorkerBaseSalaryVO> workerBaseSalaryVOs = new ArrayList<WorkerBaseSalaryVO>();
		
		for(WorkerBaseSalaryPO workerBaseSalaryPO: workerBaseSalaryPOs){
			WorkerBaseSalaryVO _workerBaseSalaryVO = new WorkerBaseSalaryVO();
			BeanUtil.copyProperties(workerBaseSalaryPO, _workerBaseSalaryVO);
			workerBaseSalaryVOs.add(_workerBaseSalaryVO);
		}
		
		paging.setData(workerBaseSalaryVOs);
	}

	@Override
	public void pageWorkerBaseSalaryForPass(Paging paging, List<Filter> filters){
		
		List<Integer> status = new ArrayList<Integer>();
		status.add(WorkerBaseSalaryPO.STATUS_TYPE_PASS_INT);
		status.add(WorkerBaseSalaryPO.STATUS_TYPE_CONFIRM_INT);
		status.add(WorkerBaseSalaryPO.STATUS_TYPE_PAYOFF_INT);
		status.add(WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT);
		
		List<WorkerBaseSalaryPO> workerBaseSalaryPOs = workerBaseSalaryDao.pageWorkerBaseSalaryByStatus(paging, filters, status);
		List<WorkerBaseSalaryVO> workerBaseSalaryVOs = new ArrayList<WorkerBaseSalaryVO>();
		
		for(WorkerBaseSalaryPO workerBaseSalaryPO: workerBaseSalaryPOs){
			WorkerBaseSalaryVO _workerBaseSalaryVO = new WorkerBaseSalaryVO();
			BeanUtil.copyProperties(workerBaseSalaryPO, _workerBaseSalaryVO);
			workerBaseSalaryVOs.add(_workerBaseSalaryVO);
		}
		
		paging.setData(workerBaseSalaryVOs);
	}

	@Override
	public List<WorkerBaseSalaryVO> queryWorkerBaseSalaryByOrder(WorkerBaseSalaryVO workerBaseSalaryVO){
		
		List<WorkerBaseSalaryPO> workerBaseSalaryPOs = workerBaseSalaryDao.queryWorkerBaseSalaryByOrderId(workerBaseSalaryVO.getOrderId());
		List<WorkerBaseSalaryVO> workerBaseSalaryVOs = new ArrayList<WorkerBaseSalaryVO>();
		
		for(WorkerBaseSalaryPO workerBaseSalaryPO: workerBaseSalaryPOs){
			WorkerBaseSalaryVO _workerBaseSalaryVO = new WorkerBaseSalaryVO();
			BeanUtil.copyProperties(workerBaseSalaryPO, _workerBaseSalaryVO);
			workerBaseSalaryVOs.add(_workerBaseSalaryVO);
		}
		
		return workerBaseSalaryVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO, String userId) throws FLException{
		
		UserPO userPO = userDao.get(userId);
		
		if(!userPO.getDuty().contains("监理")){
			throw new FLException(220002, "用户职位不是监理,不能创建工人工资");
		}
		
		WorkerBaseSalaryPO workerBaseSalaryPO = new WorkerBaseSalaryPO();
		BeanUtil.copyProperties(workerBaseSalaryVO, workerBaseSalaryPO);
		workerBaseSalaryPO.setCreateTime(DateUtil.current(WorkerBaseSalaryPO.CURRENT_TIME_FORMAT_STR));
		
		workerBaseSalaryDao.saveOrUpdate(workerBaseSalaryPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO){
		
		WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.get(workerBaseSalaryVO.getWbsId());
		
		if(workerBaseSalaryPO != null){
			workerBaseSalaryPO.setUserId(workerBaseSalaryVO.getUserId());
			workerBaseSalaryPO.setUserName(workerBaseSalaryVO.getUserName());
			workerBaseSalaryPO.setBase(workerBaseSalaryVO.getBase());
			workerBaseSalaryPO.setWorkType(workerBaseSalaryVO.getWorkType());
			
			workerBaseSalaryDao.update(workerBaseSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int passWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO, String userId) throws FLException{
		
		UserPO userPO = userDao.get(userId);
		
		if(!userPO.getDuty().contains("质检")){
			throw new FLException(220003, "用户职位不是质检,不能通过工人工资");
		}
		
		WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.get(workerBaseSalaryVO.getWbsId());
		if(workerBaseSalaryPO != null && workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
			workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_PASS_INT);
			workerBaseSalaryDao.update(workerBaseSalaryPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void confirmWorkerBaseSalary(WorkerBaseSalaryVO workerBaseSalaryVO){
		
		WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.get(workerBaseSalaryVO.getWbsId());
		if(workerBaseSalaryPO != null && workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_PASS_INT){
			workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_CONFIRM_INT);
			
			WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByUserIdInit(workerBaseSalaryVO.getUserId());
			if(workerSalaryPO != null){
				workerSalaryPO.setBase(Arith.add(workerSalaryPO.getBase(), workerBaseSalaryPO.getBase()));
			}else{
				workerSalaryPO = new WorkerSalaryPO();
				BeanUtil.copyProperties(workerBaseSalaryPO, workerSalaryPO);
				workerSalaryPO.setCreateTime(DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerSalaryPO.setEndTime(DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR));
				workerSalaryPO.setBase(workerBaseSalaryPO.getBase());
				workerSalaryPO.setWorkTypeId(workerBaseSalaryPO.getWorkTypeId());
				workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_TYPE_INIT_INT);
			}
			
			workerSalaryDao.saveOrUpdate(workerSalaryPO);
			
			workerBaseSalaryPO.setWsId(workerSalaryPO.getWsId());
			
			workerBaseSalaryDao.update(workerBaseSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void cancelWorkerBaseSalaryToInit(WorkerBaseSalaryVO workerBaseSalaryVO, String userId){
		WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.get(workerBaseSalaryVO.getWbsId());
		if(workerBaseSalaryPO != null && workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_PASS_INT){
			workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT);
			workerBaseSalaryDao.update(workerBaseSalaryPO);
			
			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(workerBaseSalaryPO.getOrderId());
			
			MessagePO messagePO = new MessagePO();
			messagePO.setSender(new UserPO(userId));
			messagePO.setReceiver(new UserPO(constructionSchedulePO.getSupervisorQualityId()));
			messagePO.setType("工人工资撤销");
			messagePO.setContents(new StringBuffer("订单编号"+workerBaseSalaryPO.getOrderId()+"工人名称"+workerBaseSalaryPO.getUserName()).toString());
			messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			messagePO.setStatus(MessagePO.MESSAGE_STATUS_UNREAD_STR);
			messagePO.setArgs("");
			
			messageDao.saveOrUpdate(messagePO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void cancelWorkerBaseSalaryToConfirm(WorkerBaseSalaryVO workerBaseSalaryVO){
		WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.get(workerBaseSalaryVO.getWbsId());
		
		if(workerBaseSalaryPO != null && workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_PASS_INT){
			
			workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_DELETE_INT);
			workerBaseSalaryDao.update(workerBaseSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteWorkerBaseSalarys(List<Integer> wbsIds){
		
		int flag = 0;
		
		for(int wbsId: wbsIds){
			
			WorkerBaseSalaryPO workerBaseSalaryPO = workerBaseSalaryDao.get(wbsId);
			
			if(workerBaseSalaryPO != null){
				if(workerBaseSalaryPO.getStatus() == WorkerBaseSalaryPO.STATUS_TYPE_INIT_INT){
					workerBaseSalaryDao.delete(workerBaseSalaryPO);
				}else{
					flag = 1;
				}
			}
		}
		
		return flag;
	}

}

