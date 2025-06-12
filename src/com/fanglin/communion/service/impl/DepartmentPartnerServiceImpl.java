package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.DepartmentPartnerDao;
import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.communion.service.DepartmentPartnerService;
import com.fanglin.communion.vo.DepartmentPartnerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;

@Service("departmentPartnerService")
@Transactional(readOnly = true)
public class DepartmentPartnerServiceImpl implements DepartmentPartnerService {

	@Autowired
	private DepartmentPartnerDao departmentPartnerDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DepartmentPartnerVO> queryDepartmentPartner(DepartmentPartnerVO departmentPartnerVO) throws FLException {

		List<DepartmentPartnerPO> departmentPartnerPOs = departmentPartnerDao.queryDepartmentPartner(departmentPartnerVO.getDid());
		List<DepartmentPartnerVO> departmentPartnerVOs = new ArrayList<DepartmentPartnerVO>();

		for (DepartmentPartnerPO departmentPartnerPO : departmentPartnerPOs) {
			departmentPartnerVOs.add(departmentPartnerPO.ptv(new DepartmentPartnerVO(new UserBaseVO())));
		}

		return departmentPartnerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDepartmentPartner(DepartmentPartnerVO departmentPartnerVO, int company) throws FLException {

		DepartmentPartnerPO departmentPartnerPO = new DepartmentPartnerPO();

		UserPO userPO = userDao.queryUserByUserId(departmentPartnerVO.getPartner().getUserId());

		departmentPartnerPO.setDid(departmentPartnerVO.getDid());
		departmentPartnerPO.setPartner(userPO);
		departmentPartnerPO.setType(departmentPartnerVO.getType());
		departmentPartnerPO.setStatus(DepartmentPartnerPO.STATUS_VALID_INT);
		departmentPartnerPO.setCompany(company);

		departmentPartnerDao.save(departmentPartnerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDepartmentPartner(DepartmentPartnerVO departmentPartnerVO) throws FLException {

		DepartmentPartnerPO departmentPartnerPO = departmentPartnerDao.get(departmentPartnerVO.getDpid());

		departmentPartnerDao.delete(departmentPartnerPO);

		return 0;
	}

}
