package com.fanglin.imports.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.salary.dao.SalaryDao;
import com.fanglin.salary.po.SalaryPO;
import com.fanglin.utils.Arith;

@Service("UserSalaryImportService")
@Transactional(readOnly = true)
public class UserSalaryImportService implements com.fanglin.imports.service.UserSalaryImportService {

	@Autowired
	private SalaryDao salaryDao;

	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importUserSalary(List<List<String>> excels, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		for (int i = 0; i < excels.size(); i++) {

			List<String> _salary = excels.get(i);

			// 列格式: 0工号 1姓名 2金额(元) 3type 4onetype 5twotype 6thrtype 7备注
			String userid = _salary.get(0);
			String name = _salary.size() > 1 ? _salary.get(1) : "";
			long money = (long) Arith.mul(Double.valueOf(_salary.get(2)), 1000);
			short type = Double.valueOf(_salary.get(3)).shortValue();
			short onetype = Double.valueOf(_salary.get(4)).shortValue();
			short twotype = Double.valueOf(_salary.get(5)).shortValue();
			short thrtype = Double.valueOf(_salary.get(6)).shortValue();
			String comment = _salary.size() > 7 ? _salary.get(7) : "";

			UserPO user = userDao.queryUserByUserId(userid);

			// 前置校验: 工号不存在或姓名不符直接报错带行号, 不吞不跳
			if (user == null || (name != null && !"".equals(name.trim()) && !name.trim().equals(user.getCurrentName()))) {
				throw new FLException(190005, String.format("人员不存在(第%d行 工号:%s)", i + 1, userid));
			}

			SalaryPO salaryPO = new SalaryPO(user, creater);

			salaryPO.setType(type);
			salaryPO.setOnetype(onetype);
			salaryPO.setTwotype(twotype);
			salaryPO.setThrtype(thrtype);
			salaryPO.setMoney(money);
			salaryPO.setStatus(SalaryPO.STATUS_BEGIN_INT);
			salaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
			salaryPO.setOperateTime(new Timestamp(System.currentTimeMillis()));
			salaryPO.setComment(comment);

			salaryDao.save(salaryPO);

			if ((i + 1) % 100 == 0) {
				salaryDao.flush();
			}
		}
	}

}
