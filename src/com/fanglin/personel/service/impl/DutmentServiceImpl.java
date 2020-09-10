package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.DepartmentPO;
import com.fanglin.communion.po.DutyPO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.DutmentDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.DutmentPO;
import com.fanglin.personel.service.DutmentService;
import com.fanglin.personel.vo.DutmentVO;
import com.fanglin.utils.BeanUtil;

@Service("dutmentService")
@Transactional(readOnly = true)
public class DutmentServiceImpl implements DutmentService {
	@Autowired
	private DutmentDao dutmentDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DutmentVO> queryDutmentByDeid(DutmentVO dutmentVO, int company) {

		List<DutmentPO> dutmentPOs = dutmentDao.queryDutmentByDeid(dutmentVO.getDept().getDid());
		List<DutmentVO> dutmentVOs = new ArrayList<DutmentVO>();

		for (DutmentPO dutmentPO : dutmentPOs) {

			dutmentVO = new DutmentVO(new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO()), new DutyVO(new DepartmentTypeVO()));

			BeanUtil.copyPropertie(dutmentPO, dutmentVO, Arrays.asList("dept", "duty"));

			BeanUtil.copyPropertie(dutmentPO.getDept(), dutmentVO.getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(dutmentPO.getDept().getType(), dutmentVO.getDept().getType());

			BeanUtil.copyPropertie(dutmentPO.getDept().getFatherDept(), dutmentVO.getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

			BeanUtil.copyPropertie(dutmentPO.getDuty(), dutmentVO.getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(dutmentPO.getDuty().getDepartmentType(), dutmentVO.getDuty().getDepartmentType());

			dutmentVOs.add(dutmentVO);
		}

		return dutmentVOs;
	}

	@Override
	public List<DutmentVO> queryDutmentByDuid(DutmentVO dutmentVO, int company) {

		List<DutmentPO> dutmentPOs = dutmentDao.queryDutmentByDuid(dutmentVO.getDuty().getDid());
		List<DutmentVO> dutmentVOs = new ArrayList<DutmentVO>();

		for (DutmentPO dutmentPO : dutmentPOs) {

			dutmentVO = new DutmentVO(new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO()), new DutyVO(new DepartmentTypeVO()));

			BeanUtil.copyPropertie(dutmentPO, dutmentVO, Arrays.asList("dept", "duty"));

			BeanUtil.copyPropertie(dutmentPO.getDept(), dutmentVO.getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyPropertie(dutmentPO.getDept().getType(), dutmentVO.getDept().getType());
			BeanUtil.copyPropertie(dutmentPO.getDept().getFatherDept(), dutmentVO.getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));

			BeanUtil.copyPropertie(dutmentPO.getDuty(), dutmentVO.getDuty(), Arrays.asList("departmentType"));
			BeanUtil.copyPropertie(dutmentPO.getDuty().getDepartmentType(), dutmentVO.getDuty().getDepartmentType());

			dutmentVOs.add(dutmentVO);
		}

		return dutmentVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDutment(DutmentVO dutmentVO, int company) throws FLException {

		DutmentPO dutmentPO = dutmentDao.queryDutmentByDids(dutmentVO.getDept().getDid(), dutmentVO.getDuty().getDid());

		if (dutmentPO != null) {
			throw new FLException(130051, "定岗信息已存在");
		}

		dutmentPO = new DutmentPO(new DepartmentPO(), new DutyPO());

		BeanUtil.copyPropertie(dutmentVO, dutmentPO, Arrays.asList("dept", "duty"));
		BeanUtil.copyPropertie(dutmentVO.getDept(), dutmentPO.getDept(), Arrays.asList("type", "fatherDept"));
		BeanUtil.copyPropertie(dutmentVO.getDuty(), dutmentPO.getDuty(), Arrays.asList("departmentType"));

		dutmentPO.setNum(userDao.countUserByDid(dutmentVO.getDept().getDid(), dutmentVO.getDuty().getDid(), company));
		dutmentPO.setLimit(dutmentVO.getLimit());

		dutmentDao.save(dutmentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDutment(DutmentVO dutmentVO) throws FLException {

		DutmentPO dutmentPO = dutmentDao.get(dutmentVO.getDid());

		if (dutmentPO == null) {
			throw new FLException(130051, "定岗信息不存在");
		}

		dutmentPO.setLimit(dutmentVO.getLimit());

		dutmentDao.update(dutmentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDutment(DutmentVO dutmentVO) {

		dutmentDao.deleteById(dutmentVO.getDid());

		return 0;
	}

}
