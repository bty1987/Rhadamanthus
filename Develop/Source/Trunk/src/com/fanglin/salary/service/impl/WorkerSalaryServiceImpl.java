package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;

@Service("workerSalaryService")
@Transactional(readOnly=true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService{

	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public WorkerSalaryVO queryWorkerSalaryByCsIdAndUserId(WorkerSalaryVO workerSalaryVO){
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByCsIdAndUserId(workerSalaryVO.getUser().getUserId(),workerSalaryVO.getCsId());
		BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO,Arrays.asList("user"));
		return workerSalaryVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addWorkerSalary(WorkerSalaryVO workerSalaryVO){
		WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO();
		BeanUtil.copyProperties(workerSalaryVO, workerSalaryPO,Arrays.asList("user"));
		workerSalaryPO.setUser(new UserPO(workerSalaryVO.getUser().getUserId()));
		WorkerSalaryPO findWorkerSalaryPO = workerSalaryDao.queryWorkerSalaryByCsIdAndUserId(workerSalaryVO.getUser().getUserId(),workerSalaryVO.getCsId());
		if (findWorkerSalaryPO == null) {
			BeanUtil.copyProperties(workerSalaryVO, workerSalaryPO,Arrays.asList("user"));
			workerSalaryPO.setUser(new UserPO(workerSalaryVO.getUser().getUserId()));
			workerSalaryPO.setType(WorkerSalaryPO.TYPE_SALARY_STR);
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_STR);
			workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryDao.addWorkerSalary(workerSalaryPO);
		} else {
			findWorkerSalaryPO.setSalary(workerSalaryPO.getSalary());
			workerSalaryDao.updateWorkerSalary(findWorkerSalaryPO);
		}
	}
	
}
