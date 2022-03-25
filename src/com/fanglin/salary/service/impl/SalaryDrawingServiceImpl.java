package com.fanglin.salary.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DataDrawingPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.salary.dao.SalaryDrawingDao;
import com.fanglin.salary.po.SalaryDrawingPO;
import com.fanglin.salary.service.SalaryDrawingService;
import com.fanglin.salary.vo.SalaryDrawingVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("salaryDrawingService")
@Transactional(readOnly = true)
public class SalaryDrawingServiceImpl implements SalaryDrawingService {

	@Autowired
	private SalaryDrawingDao salaryDrawingDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<SalaryDrawingVO> querySalaryDrawing(SalaryDrawingVO salaryDrawingVO) {

		List<SalaryDrawingPO> SalaryDrawingPOs = salaryDrawingDao.querySalaryDrawing(salaryDrawingVO.getSid(), salaryDrawingVO.getType());
		List<SalaryDrawingVO> salaryDrawingVOs = new ArrayList<SalaryDrawingVO>();

		for (SalaryDrawingPO salaryDrawingPO : SalaryDrawingPOs) {

			SalaryDrawingVO alaryDrawing = new SalaryDrawingVO(new UserVO());

			BeanUtil.copyProperties(salaryDrawingPO, alaryDrawing, Arrays.asList("creater"));

			BeanUtil.copyProperties(salaryDrawingPO.getCreater(), alaryDrawing.getCreater(), Arrays.asList("role", "dept", "duty"));

			salaryDrawingVOs.add(alaryDrawing);
		}

		return salaryDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addSalaryDrawing(SalaryDrawingVO salaryDrawingVO, String userId, int company) throws FLException {

		SystemConfigPO salarydrawinglimit = systemConfigDao.querySystemConfig("salarydrawinglimit", company);

		if (salaryDrawingDao.countSalaryDrawing(salaryDrawingVO.getSid(), salaryDrawingVO.getType()) > (salarydrawinglimit == null ? 6 : Integer.getInteger(salarydrawinglimit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		SalaryDrawingPO salaryDrawingPO = new SalaryDrawingPO();

		BeanUtil.copyProperties(salaryDrawingVO, salaryDrawingPO, Arrays.asList("creater"));

		salaryDrawingPO.setCreater(userDao.queryUserByUserId(userId));
		salaryDrawingPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		salaryDrawingPO.setStatus(DataDrawingPO.STATUS_INIT_INT);

		salaryDrawingDao.save(salaryDrawingPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteSalaryDrawing(SalaryDrawingVO salaryDrawingVO) throws FLException {

		SalaryDrawingPO salaryDrawingPO = salaryDrawingDao.get(salaryDrawingVO.getSdid());

		if (salaryDrawingPO != null) {

			salaryDrawingPO.setStatus(DataDrawingPO.STATUS_DISABLE_INT);

			salaryDrawingDao.update(salaryDrawingPO);
		}
	}

}
