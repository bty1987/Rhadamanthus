package com.fanglin.salary.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.salary.dao.SalaryDao;
import com.fanglin.salary.po.SalaryPO;
import com.fanglin.salary.service.SalaryService;
import com.fanglin.salary.vo.SalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("salaryService")
@Transactional(readOnly = true)
public class SalaryServiceImpl implements SalaryService {

	@Autowired
	private SalaryDao salaryDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageSalary(Paging paging, List<Filter> filters) {

		List<SalaryPO> salaryPOs = salaryDao.pageSalary(paging, filters);
		List<SalaryVO> salaryVOs = new ArrayList<SalaryVO>();

		for (SalaryPO salaryPO : salaryPOs) {

			SalaryVO salaryVO = new SalaryVO(new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(salaryPO, salaryVO, Arrays.asList("user", "operater"));
			BeanUtil.copyProperties(salaryPO.getUser(), salaryVO.getUser(), Arrays.asList("duty", "dept", "role"));
			BeanUtil.copyProperties(salaryPO.getOperater(), salaryVO.getOperater(), Arrays.asList("duty", "dept", "role"));

			salaryVOs.add(salaryVO);
		}
		paging.setData(salaryVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalary(SalaryVO salaryVO) {

		UserPO user = userDao.queryUserByUserId(salaryVO.getUser().getUserId());

		SalaryPO salaryPO = new SalaryPO();

		salaryPO.setUser(user);
		salaryPO.setType(salaryVO.getType());
		salaryPO.setOnetype(salaryVO.getOnetype());
		salaryPO.setTwotype(salaryVO.getTwotype());
		salaryPO.setThrtype(salaryVO.getThrtype());
		salaryPO.setMoney(salaryVO.getMoney());
		salaryPO.setStatus(SalaryPO.STATUS_BEGIN_INT);
		salaryPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		salaryPO.setComment(salaryVO.getComment());

		salaryDao.save(salaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int passSalary(SalaryVO salaryVO, String userId) throws FLException {

		UserPO operater = userDao.queryUserByUserId(userId);

		SalaryPO salaryPO = salaryDao.get(salaryVO.getSid());

		if (salaryPO.getStatus() != SalaryPO.STATUS_BEGIN_INT) {

			throw new FLException(280002, "薪资状态不可操作");
		}

		salaryPO.setOperateTime(new Timestamp(System.currentTimeMillis()));
		salaryPO.setOperater(operater);
		salaryPO.setStatus(SalaryPO.STATUS_PASS_INT);

		salaryDao.update(salaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectSalary(SalaryVO salaryVO, String userId) throws FLException {

		UserPO operater = userDao.queryUserByUserId(userId);

		SalaryPO salaryPO = salaryDao.get(salaryVO.getSid());

		if (salaryPO.getStatus() != SalaryPO.STATUS_BEGIN_INT) {

			throw new FLException(280002, "薪资状态不可操作");
		}

		salaryPO.setOperateTime(new Timestamp(System.currentTimeMillis()));
		salaryPO.setOperater(operater);
		salaryPO.setStatus(SalaryPO.STATUS_REFUSE_INT);

		salaryDao.update(salaryPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSalary(SalaryVO salaryVO, String userId) throws FLException {

		UserPO operater = userDao.queryUserByUserId(userId);

		SalaryPO salaryPO = salaryDao.get(salaryVO.getSid());

		if (salaryPO.getStatus() != SalaryPO.STATUS_BEGIN_INT) {

			throw new FLException(280002, "薪资状态不可操作");
		}

		salaryPO.setOperateTime(new Timestamp(System.currentTimeMillis()));
		salaryPO.setOperater(operater);
		salaryPO.setStatus(SalaryPO.STATUS_REPEAL_INT);

		salaryDao.update(salaryPO);

		return 0;
	}

}
