package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.salary.service.WorkerSalaryService;
import com.fanglin.salary.vo.WorkerSalaryVO;
import com.fanglin.utils.BeanUtil;

@Service("workerSalaryService")
@Transactional(readOnly=true)
public class WorkerSalaryServiceImpl implements WorkerSalaryService{

	@Autowired
	private WorkerSalaryDao workerSalaryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public WorkerSalaryVO queryWorkerSalaryByCsIdAndUserId(WorkerSalaryVO workerSalaryVO){
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByCsIdAndUserId(workerSalaryVO.getUser().getUserId(),workerSalaryVO.getCsId());
		BeanUtil.copyProperties(workerSalaryPO, workerSalaryVO,Arrays.asList("user"));
		BeanUtil.copyProperties(userDao.get(workerSalaryVO.getUser().getUserId()), workerSalaryVO.getUser(), Arrays.asList("dept","role"));
		return workerSalaryVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateWorkerSalary(WorkerSalaryVO workerSalaryVO){
		WorkerSalaryPO workerSalaryPO = workerSalaryDao.queryWorkerSalaryByCsIdAndUserId(workerSalaryVO.getUser().getUserId(),workerSalaryVO.getCsId());
		if (workerSalaryPO == null) {
			workerSalaryPO = new WorkerSalaryPO(new UserPO());
			BeanUtil.copyProperties(workerSalaryVO, workerSalaryPO,Arrays.asList("user"));
			BeanUtil.copyProperties(userDao.get(workerSalaryVO.getUser().getUserId()), workerSalaryPO.getUser(), Arrays.asList("dept","role"));
			workerSalaryPO.setType(WorkerSalaryPO.TYPE_SALARY_STR);
			workerSalaryPO.setStatus(WorkerSalaryPO.STATUS_INIT_STR);
			workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setBalanceTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryDao.save(workerSalaryPO);
		} else {
			workerSalaryPO.setSalary(workerSalaryVO.getSalary());
			workerSalaryDao.update(workerSalaryPO);
		}
	}
	
}
