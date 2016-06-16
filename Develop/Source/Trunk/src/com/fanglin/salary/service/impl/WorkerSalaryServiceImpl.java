/**
 * @File Name		: WorkerSalaryServiceImpl.java
 * @Package   	: com.fanglin.service.impl.salary
 * @Version		: 1.0
 * @Date			: 2014-10-30
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

import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.dao.WorkerBaseSalaryDao;
import com.fanglin.salary.dao.WorkerDeductSalaryDao;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerBaseSalaryPO;
import com.fanglin.salary.po.WorkerDeductSalaryPO;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryExcelVO;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("workerSalaryService")
@Transactional(readOnly=true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService {
	
	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	@Autowired
	private WorkerBaseSalaryDao workerBaseSalaryDao;
	
	@Autowired
	private WorkerDeductSalaryDao workerDeductSalaryDao;

	@Override
	public void pageWorkerSalaryForInit(Paging paging, List<FilterVO> filters){
		
		List<Integer> status = new ArrayList<Integer>();
		status.add(WorkerSalaryPO.STATUS_TYPE_INIT_INT);
		
		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging, filters, status);
		List<WorkerSalaryVO> workerSalaryVOs = new ArrayList<WorkerSalaryVO>();
		
		for(WorkerSalaryPO workerSalaryPO: workerSalaryPOs){
			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO();
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO);
			
			workerSalaryVOs.add(workerSalaryVO);
		}
		
		paging.setData(workerSalaryVOs);
	}

	@Override
	public void pageWorkerSalaryForPayOff(Paging paging, List<FilterVO> filters){
		
		List<Integer> status = new ArrayList<Integer>();
		status.add(WorkerSalaryPO.STATUS_TYPE_PAYOFF);
		
		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging, filters, status);
		List<WorkerSalaryVO> workerSalaryVOs = new ArrayList<WorkerSalaryVO>();
		
		for(WorkerSalaryPO workerSalaryPO: workerSalaryPOs){
			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO();
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO);
			
			workerSalaryVOs.add(workerSalaryVO);
		}
		
		paging.setData(workerSalaryVOs);
	}

	@Override
	public void pageWorkerSalaryForUnPayOff(Paging paging, List<FilterVO> filters){
		
		List<Integer> status = new ArrayList<Integer>();
		status.add(WorkerSalaryPO.STATUS_TYPE_UNPAYOFF);
		
		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.pageWorkerSalary(paging, filters, status);
		List<WorkerSalaryVO> workerSalaryVOs = new ArrayList<WorkerSalaryVO>();
		
		for(WorkerSalaryPO workerSalaryPO: workerSalaryPOs){
			WorkerSalaryVO workerSalaryVO = new WorkerSalaryVO();
			BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO);
			
			workerSalaryVOs.add(workerSalaryVO);
		}
		
		paging.setData(workerSalaryVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<WorkerSalaryExcelVO> payoffWorkerSalary(){
		
		List<Integer> status = new ArrayList<Integer>();
		status.add(WorkerSalaryPO.STATUS_TYPE_INIT_INT);
		
		String currentTime = DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR);
		
		List<WorkerSalaryPO> workerSalaryPOs = workerSalaryDao.queryWorkerSalary(status);
		
		for(WorkerSalaryPO workerSalaryPO: workerSalaryPOs){
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_TYPE_PAYOFF);
			workerSalaryPO.setEndTime(currentTime);
			
			List<WorkerBaseSalaryPO> workerBaseSalaryPOs = workerBaseSalaryDao.queryWorkerBaseSalaryByWsIdPayOff(workerSalaryPO.getWsId());
			for(WorkerBaseSalaryPO workerBaseSalaryPO: workerBaseSalaryPOs){
				workerBaseSalaryPO.setStatus(WorkerBaseSalaryPO.STATUS_TYPE_PAYOFF_INT);
				workerBaseSalaryDao.update(workerBaseSalaryPO);
			}
			
			List<WorkerDeductSalaryPO> workerDeductSalaryPOs = workerDeductSalaryDao.queryWorkerdeductByWsIdPayOff(workerSalaryPO.getWsId());
			for(WorkerDeductSalaryPO workerDeductSalaryPO: workerDeductSalaryPOs){
				workerDeductSalaryPO.setStatus(WorkerDeductSalaryPO.STATUS_TYPE_PAYOFF_INT);
				workerDeductSalaryDao.update(workerDeductSalaryPO);
			}
			
			float total = Arith.sub(workerSalaryPO.getBase(), workerSalaryPO.getDeduct());
			
			if(total < 0){
				
				WorkerSalaryPO _workerSalaryPO = new WorkerSalaryPO();
				BeanUtil.copyProperties(workerSalaryPO, _workerSalaryPO);
				_workerSalaryPO.setDeduct(Math.abs(total));
				_workerSalaryPO.setBase(0);
				_workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_TYPE_INIT_INT);
				_workerSalaryPO.setWsId(0);
				_workerSalaryPO.setPwsId(workerSalaryPO.getWsId());
				_workerSalaryPO.setCreateTime(DateUtil.current(WorkerSalaryPO.CURRENT_TIME_FORMAT_STR));
				_workerSalaryPO.setEndTime(currentTime);
				
				workerSalaryDao.saveOrUpdate(_workerSalaryPO);
				
				WorkerDeductSalaryPO workerDeductSalaryPO = new WorkerDeductSalaryPO();
				BeanUtil.copyProperties(workerSalaryPO, workerDeductSalaryPO);
				workerDeductSalaryPO.setCreateTime(currentTime);
				workerDeductSalaryPO.setWsId(_workerSalaryPO.getWsId());
				workerDeductSalaryPO.setDeduct(Math.abs(total));
				workerDeductSalaryPO.setDes("结算工资产生的扣款信息");
				workerDeductSalaryPO.setOrderId("");
				
				workerDeductSalaryDao.saveOrUpdate(workerDeductSalaryPO);
			}
			
			workerSalaryDao.update(workerSalaryPO);
		}
		
		return null;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void payoffWorkerSalary(WorkerSalaryVO workerSalaryVO){
		
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByWsId(workerSalaryVO.getWsId());
		
		if(workerSalaryPO != null && workerSalaryPO.getStatus() == WorkerSalaryPO.STATUS_TYPE_UNPAYOFF){
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_TYPE_PAYOFF);
			
			workerSalaryDao.update(workerSalaryPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void unPayoffWorkerSalary(WorkerSalaryVO workerSalaryVO){
		
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByWsId(workerSalaryVO.getWsId());
		
		if(workerSalaryPO != null && workerSalaryPO.getStatus() == WorkerSalaryPO.STATUS_TYPE_PAYOFF){
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_TYPE_UNPAYOFF);
			
			workerSalaryDao.update(workerSalaryPO);
		}
	}

}
