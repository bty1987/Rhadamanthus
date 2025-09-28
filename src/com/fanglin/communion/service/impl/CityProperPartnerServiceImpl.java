package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CityProperPartnerDao;
import com.fanglin.communion.po.CityProperPartnerPO;
import com.fanglin.communion.po.DepartmentPartnerPO;
import com.fanglin.communion.service.CityProperPartnerService;
import com.fanglin.communion.vo.CityProperPartnerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;

@Service("cityProperPartnerService")
@Transactional(readOnly = true)
public class CityProperPartnerServiceImpl implements CityProperPartnerService {

	@Autowired
	private CityProperPartnerDao cityProperPartnerDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<CityProperPartnerVO> queryCityProperPartner(CityProperPartnerVO cityProperPartner) throws FLException {

		List<CityProperPartnerPO> cityProperPartnerPOs = cityProperPartnerDao.queryCityProperPartner(cityProperPartner.getCpid());
		List<CityProperPartnerVO> cityProperPartnerVOs = new ArrayList<CityProperPartnerVO>();

		for (CityProperPartnerPO cityProperPartnerPO : cityProperPartnerPOs) {
			cityProperPartnerVOs.add(cityProperPartnerPO.ptv(new CityProperPartnerVO(new UserBaseVO())));
		}

		return cityProperPartnerVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCityProperPartner(CityProperPartnerVO cityProperPartner, int company) throws FLException {

		CityProperPartnerPO cityProperPartnerPO = new CityProperPartnerPO();

		UserPO userPO = userDao.queryUserByUserId(cityProperPartner.getPartner().getUserId());

		cityProperPartnerPO.setCpid(cityProperPartner.getCpid());
		cityProperPartnerPO.setPartner(userPO);
		cityProperPartnerPO.setType(cityProperPartner.getType());
		cityProperPartnerPO.setStatus(DepartmentPartnerPO.STATUS_VALID_INT);
		cityProperPartnerPO.setCompany(company);

		cityProperPartnerDao.save(cityProperPartnerPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteCityProperPartner(CityProperPartnerVO cityProperPartner) throws FLException {

		CityProperPartnerPO cityProperPartnerPO = cityProperPartnerDao.get(cityProperPartner.getCppid());

		cityProperPartnerDao.delete(cityProperPartnerPO);

		return 0;
	}

}
