package com.fanglin.imports.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.WorkerSalaryDao;
import com.fanglin.salary.po.WorkerSalaryPO;
import com.fanglin.utils.Arith;

@Service("WorkerSalaryImportService")
@Transactional(readOnly = true)
public class WorkerSalaryImportService implements com.fanglin.imports.service.WorkerSalaryImportService {

	public static final short SUBTYPY_SHORTTHREE = 3;
	public static final short SUBTYPY_SHORTONE = 0;

	@Autowired
	private WorkerSalaryDao workerSalaryDao;

	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateWorkerSalaryForAdvance(List<List<String>> excels, String userId) {

		int index = 1;

		WorkerSalaryPO workerSalaryPO;

		for (int i = 0; i < excels.size(); i++) {

			List<String> _salary = excels.get(i);
			long wsId = Long.valueOf(_salary.get(0));
			short status = Short.valueOf(_salary.get(1));

			workerSalaryPO = workerSalaryDao.get(wsId);

			if (workerSalaryPO == null) {
				continue;
			}

			UserPO userPO = userDao.queryUserByUserId(userId);

			workerSalaryPO.setStatus(status);
			workerSalaryPO.setApprover(userPO);
			workerSalaryPO.setApproveTime(new Timestamp(System.currentTimeMillis()));

			workerSalaryDao.update(workerSalaryPO);

			if (index % 100 == 0) {
				workerSalaryDao.flush();
			}
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importWorkerSalary(List<List<String>> excels, String userId) {

		int index = 1;

		for (int i = 0; i < excels.size(); i++) {

			List<String> _salary = excels.get(i);

			String userid = _salary.get(0);
			long salary = Double.valueOf(_salary.get(2)).longValue();
			short subtype = Double.valueOf(_salary.get(3)).shortValue();
			String comment = _salary.get(4);

			UserPO worker = userDao.queryUserByUserId(userid);
			UserPO creater = userDao.queryUserByUserId(userId);

			WorkerSalaryPO workerSalaryPO = new WorkerSalaryPO(worker, creater);

			if (subtype <= SUBTYPY_SHORTTHREE && subtype > SUBTYPY_SHORTONE) {
				workerSalaryPO.setType(WorkerSalaryPO.TYPE_ADD_INT);
			} else {
				workerSalaryPO.setType(WorkerSalaryPO.TYPE_SUB_INT);
			}

			workerSalaryPO.setCompany(creater.getCompany());
			workerSalaryPO.setUser(worker);
			workerSalaryPO.setSubtype(subtype);
			workerSalaryPO.setComment(comment);
			workerSalaryPO.setSalary((long)Arith.mul(salary, 1000.0));
			workerSalaryPO.setCreater(creater);
			workerSalaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			workerSalaryPO.setCsid(0);

			workerSalaryDao.save(workerSalaryPO);
		}

		if (index % 100 == 0) {
			workerSalaryDao.flush();
		}
	}

}
